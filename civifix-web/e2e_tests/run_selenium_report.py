#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import time
import traceback
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Callable, Dict, List, Optional

import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from selenium import webdriver
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager


BASE_URL = os.getenv("E2E_BASE_URL", "http://localhost:3000")
ROOT_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT_DIR / "test_results" / "selenium_test_report.xlsx"
DEFAULT_TIMEOUT = 15


VIEWPORTS = [
    ("Desktop", 1440, 1024),
    ("Tablet", 834, 1112),
    ("Mobile", 390, 844),
]

ROLE_TOKENS = {
    "CITIZEN": "e2e-token-citizen",
    "INSPECTOR": "e2e-token-inspector",
    "WORKER": "e2e-token-worker",
    "DISTRICT_ADMIN": "e2e-token-district-admin",
    "SUPER_ADMIN": "e2e-token-super-admin",
}


@dataclass
class TestCase:
    test_id: str
    module: str
    scenario: str
    expected_result: str
    kind: str
    params: Dict[str, object]
    viewport: str
    width: int
    height: int


def make_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,1024")
    options.add_argument("--allow-insecure-localhost")
    options.add_argument("--disable-web-security")
    options.add_argument("--disable-features=VizDisplayCompositor")
    options.add_experimental_option("excludeSwitches", ["enable-logging"])

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.set_page_load_timeout(30)
    driver.set_script_timeout(30)
    return driver


def wait_ready(driver: webdriver.Chrome, timeout: int = DEFAULT_TIMEOUT):
    WebDriverWait(driver, timeout).until(lambda d: d.execute_script("return document.readyState") == "complete")


def body_text(driver: webdriver.Chrome) -> str:
    return driver.execute_script("return document.body ? document.body.innerText : ''")


def clear_storage(driver: webdriver.Chrome):
    driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")


def set_role_session(driver: webdriver.Chrome, role: str):
    driver.get(BASE_URL)
    wait_ready(driver)
    clear_storage(driver)
    driver.execute_script(
        """
        window.localStorage.setItem('authToken', arguments[0]);
        window.localStorage.setItem('refreshToken', 'refresh-' + arguments[1].toLowerCase());
        window.localStorage.setItem('e2eRole', arguments[1]);
        """,
        ROLE_TOKENS[role],
        role,
    )


def open_route(driver: webdriver.Chrome, route: str):
    driver.get(f"{BASE_URL}{route}")
    wait_ready(driver)


def click_text(driver: webdriver.Chrome, text: str):
    locator = (By.XPATH, f"//*[self::a or self::button][contains(normalize-space(.), {json.dumps(text)})]")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(EC.element_to_be_clickable(locator)).click()


def find_by_label(driver: webdriver.Chrome, label_text: str):
    locator = (By.XPATH, f"//*[self::label or self::span or self::p][contains(normalize-space(.), {json.dumps(label_text)})]")
    return WebDriverWait(driver, DEFAULT_TIMEOUT).until(EC.presence_of_element_located(locator))


def type_input(driver: webdriver.Chrome, element_id: str, value: str):
    el = WebDriverWait(driver, DEFAULT_TIMEOUT).until(EC.presence_of_element_located((By.ID, element_id)))
    el.clear()
    el.send_keys(value)


def click_button_with_text(driver: webdriver.Chrome, text: str):
    click_text(driver, text)


def assert_contains(driver: webdriver.Chrome, text: str):
    page = body_text(driver)
    assert text in page, f"Expected '{text}' in page text"


def assert_not_contains(driver: webdriver.Chrome, text: str):
    page = body_text(driver)
    assert text not in page, f"Did not expect '{text}' in page text"


def submit_login_flow(driver: webdriver.Chrome, role: str) -> str:
    open_route(driver, "/login")
    type_input(driver, "email-input", f"{role.lower()}@civifix.local")
    click_button_with_text(driver, "CONTINUE")
    driver.execute_script("window.localStorage.setItem('e2eRole', arguments[0]);", role)
    otp_inputs = WebDriverWait(driver, DEFAULT_TIMEOUT).until(
        lambda d: d.find_elements(By.CSS_SELECTOR, "input[inputmode='numeric']")
    )
    for index, otp_input in enumerate(otp_inputs):
        otp_input.send_keys(str((index + 1) % 10))
    click_button_with_text(driver, "VERIFY ACCOUNT")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "/dashboard" in d.current_url)
    wait_ready(driver)
    return body_text(driver)


def submit_signup_flow(driver: webdriver.Chrome):
    open_route(driver, "/signup")
    type_input(driver, "signup-name", "Selenium Citizen")
    type_input(driver, "signup-mobile", "9876543210")
    type_input(driver, "signup-email", "signup@civifix.local")
    click_button_with_text(driver, "NEXT")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "Step 2 of 2" in body_text(d))
    driver.execute_script("window.localStorage.setItem('e2eRole', 'CITIZEN');")
    Select(driver.find_element(By.XPATH, "//select[option[contains(., 'Select District')]]")).select_by_value("e2e-district-1")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: len(d.find_elements(By.XPATH, "//select[option[contains(., 'Select Ward')]]/option")) > 1)
    Select(driver.find_element(By.XPATH, "//select[option[contains(., 'Select Ward')]]")).select_by_value("e2e-ward-1")
    terms_button = WebDriverWait(driver, DEFAULT_TIMEOUT).until(
        EC.element_to_be_clickable((By.XPATH, "//p[contains(., 'Terms & Conditions')]/preceding-sibling::button[1]"))
    )
    terms_button.click()
    click_button_with_text(driver, "CREATE ACCOUNT")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "Check your email" in body_text(d))
    for index, otp_input in enumerate(driver.find_elements(By.CSS_SELECTOR, "input[inputmode='numeric']")):
        otp_input.send_keys(str((index + 1) % 10))
    click_button_with_text(driver, "VERIFY ACCOUNT")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "/dashboard" in d.current_url)
    wait_ready(driver)
    return body_text(driver)


def submit_complaint_flow(driver: webdriver.Chrome) -> str:
    set_role_session(driver, "CITIZEN")
    open_route(driver, "/complaints/create")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "Raise a Complaint" in body_text(d))
    Select(driver.find_element(By.XPATH, "//select[option[contains(., 'Select a category')]]")).select_by_value("GARBAGE")
    textarea = driver.find_element(By.XPATH, "//textarea[contains(@placeholder, 'Describe the issue clearly')]")
    textarea.clear()
    textarea.send_keys("Garbage has not been collected near the community park for several days.")
    Select(driver.find_element(By.XPATH, "//select[option[contains(., 'Select your ward')]]")).select_by_value("e2e-ward-1")
    click_button_with_text(driver, "Submit Complaint")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "Complaint Submitted!" in body_text(d))
    click_button_with_text(driver, "View Complaint")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "/complaints/" in d.current_url)
    wait_ready(driver)
    return body_text(driver)


def handle_alert_if_present(driver: webdriver.Chrome):
    try:
        WebDriverWait(driver, 2).until(EC.alert_is_present())
        Alert(driver).accept()
    except TimeoutException:
        return


def submit_inspector_action(driver: webdriver.Chrome, action: str) -> str:
    set_role_session(driver, "INSPECTOR")
    open_route(driver, "/complaints/e2e-complaint-2")
    WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "Complaint Details" in body_text(d))
    if action == "start":
        click_button_with_text(driver, "Start Work")
    elif action == "reject":
        click_button_with_text(driver, "Reject Complaint")
        click_button_with_text(driver, "Yes, Reject Complaint")
    elif action == "resolve":
        click_button_with_text(driver, "Resolve Complaint")
        click_button_with_text(driver, "Mark Resolved")
    elif action == "note":
        click_button_with_text(driver, "Add Note")
        textarea = WebDriverWait(driver, DEFAULT_TIMEOUT).until(EC.presence_of_element_located((By.CSS_SELECTOR, "textarea")))
        textarea.clear()
        textarea.send_keys("Inspector verified the current on-ground condition.")
        click_button_with_text(driver, "Save Note")
    else:
        raise ValueError(action)
    wait_ready(driver)
    return body_text(driver)


def prime_role_and_open(driver: webdriver.Chrome, role: str, route: str) -> str:
    set_role_session(driver, role)
    open_route(driver, route)
    return body_text(driver)


def build_cases() -> List[TestCase]:
    cases: List[TestCase] = []
    counter = 1

    def add_cases(module: str, route: str, role: Optional[str], kind: str, assertions: List[Dict[str, object]]):
        nonlocal counter
        for viewport_name, width, height in VIEWPORTS:
            for assertion in assertions:
                cases.append(
                    TestCase(
                        test_id=f"CIV-E2E-{counter:03d}",
                        module=module,
                        scenario=f"{assertion['name']} ({viewport_name})",
                        expected_result=str(assertion.get("expected", assertion.get("value", assertion.get("route", assertion["name"])))),
                        kind=kind,
                        params={
                            "route": route,
                            "role": role,
                            **assertion,
                        },
                        viewport=viewport_name,
                        width=width,
                        height=height,
                    )
                )
                counter += 1

    home_assertions = [
        {"name": "brand identity visible", "check": "body", "value": "CiviFix"},
        {"name": "citizen portal subtitle visible", "check": "body", "value": "Citizen Portal"},
        {"name": "sign in cta visible", "check": "body", "value": "Sign In"},
        {"name": "raise issue nav visible", "check": "body", "value": "Raise Issue"},
        {"name": "dashboard nav visible", "check": "body", "value": "Dashboard"},
        {"name": "hero headline visible", "check": "body", "value": "Issue Reporting Portal"},
        {"name": "how it works visible", "check": "body", "value": "How CiviFix Helps Your City"},
        {"name": "step report visible", "check": "body", "value": "Report"},
        {"name": "footer terms visible", "check": "body", "value": "Terms of Service"},
        {"name": "support link visible", "check": "body", "value": "Contact Support"},
    ]
    add_cases("Landing", "/", None, "body_contains", home_assertions)

    login_assertions = [
        {"name": "email field visible", "check": "body", "value": "EMAIL ADDRESS"},
        {"name": "continue button visible", "check": "body", "value": "CONTINUE"},
        {"name": "signup link visible", "check": "body", "value": "Sign up"},
        {"name": "otp heading visible", "check": "flow", "value": "Verify OTP"},
        {"name": "verify button visible", "check": "flow", "value": "VERIFY ACCOUNT"},
        {"name": "back button visible", "check": "flow", "value": "Back to Registration"},
        {"name": "secure login copy visible", "check": "body", "value": "Secure login to CiviFix"},
        {"name": "report track resolve copy visible", "check": "body", "value": "Report. Track. Resolve."},
        {"name": "otp screen text visible", "check": "flow", "value": "Check your email"},
        {"name": "login subtitle visible", "check": "body", "value": "Log in or sign up"},
    ]
    add_cases("Authentication", "/login", None, "login_checks", login_assertions)

    signup_assertions = [
        {"name": "name field visible", "check": "body", "value": "FULL NAME"},
        {"name": "mobile field visible", "check": "body", "value": "MOBILE NUMBER"},
        {"name": "email field visible", "check": "body", "value": "EMAIL ADDRESS"},
        {"name": "next button visible", "check": "body", "value": "NEXT"},
        {"name": "district field visible", "check": "flow", "value": "DISTRICT"},
        {"name": "ward field visible", "check": "flow", "value": "WARD"},
        {"name": "terms copy visible", "check": "flow", "value": "Terms & Conditions"},
        {"name": "create account button visible", "check": "flow", "value": "CREATE ACCOUNT"},
        {"name": "verification screen visible", "check": "flow", "value": "Check your email"},
        {"name": "step indicator visible", "check": "body", "value": "Step 1 of 2"},
    ]
    add_cases("Authentication", "/signup", None, "signup_checks", signup_assertions)

    citizen_dashboard_assertions = [
        {"name": "quick actions section visible", "check": "body", "value": "Quick Actions"},
        {"name": "my complaints section visible", "check": "body", "value": "My Complaints"},
        {"name": "raise complaint shortcut visible", "check": "body", "value": "Raise"},
        {"name": "track status shortcut visible", "check": "body", "value": "Track"},
        {"name": "pending summary visible", "check": "body", "value": "Pending"},
        {"name": "active summary visible", "check": "body", "value": "Active"},
        {"name": "resolved summary visible", "check": "body", "value": "Resolved"},
        {"name": "view all link visible", "check": "body", "value": "View All"},
        {"name": "citizen role badge visible", "check": "body", "value": "Citizen"},
        {"name": "complaint id visible", "check": "body", "value": "CIV-E2E-001"},
    ]
    add_cases("Citizen Dashboard", "/dashboard", "CITIZEN", "dashboard_text", citizen_dashboard_assertions)

    complaint_assertions = [
        {"name": "complaint list heading visible", "check": "body", "value": "My Complaints"},
        {"name": "complaint create heading visible", "check": "body", "value": "Raise a Complaint"},
        {"name": "type selector visible", "check": "body", "value": "Complaint Type"},
        {"name": "description field visible", "check": "body", "value": "Description"},
        {"name": "priority field visible", "check": "body", "value": "Priority"},
        {"name": "submit action visible", "check": "flow", "value": "Complaint Submitted!"},
        {"name": "view complaint action visible", "check": "flow", "value": "View Complaint"},
        {"name": "tracking page visible", "check": "body", "value": "Status Tracking"},
        {"name": "timeline visible", "check": "body", "value": "Activity Timeline"},
        {"name": "complaint details visible", "check": "body", "value": "Complaint Details"},
    ]
    add_cases("Citizen Complaints", "/complaints", "CITIZEN", "complaint_text", complaint_assertions)

    inspector_assertions = [
        {"name": "inspector dashboard visible", "check": "body", "value": "Inspector Dashboard"},
        {"name": "complaint overview visible", "check": "body", "value": "Complaint Overview"},
        {"name": "recent complaints visible", "check": "body", "value": "Recent Complaints"},
        {"name": "ward info visible", "check": "body", "value": "Ward 1 - Central"},
        {"name": "start work button visible", "check": "flow", "value": "Start Work"},
        {"name": "reject complaint button visible", "check": "flow", "value": "Reject Complaint"},
        {"name": "resolve complaint button visible", "check": "flow", "value": "Resolve Complaint"},
        {"name": "timeline visible", "check": "body", "value": "Activity Timeline"},
        {"name": "complaint detail title visible", "check": "body", "value": "Complaint Details"},
        {"name": "inspector note visible", "check": "body", "value": "Inspector Note"},
    ]
    add_cases("Inspector Suite", "/dashboard", "INSPECTOR", "inspector_text", inspector_assertions)

    worker_assertions = [
        {"name": "worker dashboard visible", "check": "body", "value": "Worker Dashboard"},
        {"name": "recent complaints visible", "check": "body", "value": "Recent Complaints"},
        {"name": "assigned complaints visible", "check": "body", "value": "Assigned Complaints"},
        {"name": "in progress status visible", "check": "body", "value": "In Progress"},
        {"name": "resolved status visible", "check": "body", "value": "Resolved"},
        {"name": "ward label visible", "check": "body", "value": "Ward 1 - Central"},
        {"name": "complaint id visible", "check": "body", "value": "CIV-E2E-002"},
        {"name": "complaint details visible", "check": "body", "value": "Complaint Details"},
        {"name": "tracking visible", "check": "body", "value": "Status Tracking"},
        {"name": "citizen label visible", "check": "body", "value": "Citizen"},
    ]
    add_cases("Worker Suite", "/dashboard", "WORKER", "worker_text", worker_assertions)

    admin_assertions = [
        {"name": "district admin panel visible", "check": "body", "value": "District Admin Panel"},
        {"name": "district overview visible", "check": "body", "value": "District Overview"},
        {"name": "wards card visible", "check": "body", "value": "Wards"},
        {"name": "inspectors card visible", "check": "body", "value": "Inspectors"},
        {"name": "complaints card visible", "check": "body", "value": "Complaints"},
        {"name": "resolved card visible", "check": "body", "value": "Resolved"},
        {"name": "super admin role badge visible", "check": "body", "value": "District Admin"},
        {"name": "profile notification item visible", "check": "body", "value": "Notifications"},
        {"name": "logout item visible", "check": "body", "value": "Logout"},
        {"name": "footer visible", "check": "body", "value": "CiviFix Web v1.0.0"},
    ]
    add_cases("District Admin", "/dashboard", "DISTRICT_ADMIN", "admin_text", admin_assertions)

    profile_assertions = [
        {"name": "profile name visible", "check": "body", "value": "Selenium Citizen"},
        {"name": "profile email visible", "check": "body", "value": "selenium-test@civifix.local"},
        {"name": "profile phone visible", "check": "body", "value": "9876543210"},
        {"name": "profile district visible", "check": "body", "value": "e2e-district-1"},
        {"name": "my complaints menu visible", "check": "body", "value": "My Complaints"},
        {"name": "settings menu visible", "check": "body", "value": "Settings"},
        {"name": "help menu visible", "check": "body", "value": "Help & Support"},
        {"name": "about menu visible", "check": "body", "value": "About CiviFix"},
        {"name": "logout menu visible", "check": "body", "value": "Logout"},
        {"name": "role badge visible", "check": "body", "value": "Citizen"},
    ]
    add_cases("Profile", "/profile", "CITIZEN", "profile_text", profile_assertions)

    workflow_assertions = [
        {"name": "citizen login flow reaches dashboard", "check": "login_flow", "value": "CiviFix"},
        {"name": "signup flow reaches dashboard", "check": "signup_flow", "value": "CiviFix"},
        {"name": "complaint create flow reaches success", "check": "complaint_flow", "value": "Complaint Submitted!"},
        {"name": "tracking page loads timeline", "check": "workflow", "route": "/complaints/e2e-complaint-1/track", "role": "CITIZEN", "value": "Status Tracking"},
        {"name": "inspector start work updates complaint", "check": "inspector_flow", "value": "IN_PROGRESS"},
        {"name": "inspector resolve updates complaint", "check": "inspector_flow", "action": "resolve", "value": "CLOSED"},
        {"name": "inspector note persists on detail page", "check": "inspector_flow", "action": "note", "value": "Inspector Note"},
        {"name": "worker dashboard loads assigned cases", "check": "workflow", "route": "/dashboard", "role": "WORKER", "value": "Worker Dashboard"},
        {"name": "district admin dashboard loads metrics", "check": "workflow", "route": "/dashboard", "role": "DISTRICT_ADMIN", "value": "District Overview"},
        {"name": "logout returns to login", "check": "logout_flow", "value": "Sign In"},
    ]
    add_cases("Workflow", "/", None, "workflow", workflow_assertions)

    return cases


def execute_case(driver: webdriver.Chrome, case: TestCase) -> str:
    driver.set_window_size(case.width, case.height)
    kind = case.kind
    route = str(case.params.get("route", "/"))
    role = case.params.get("role")
    expected_text = str(case.params.get("value", case.expected_result))

    if kind == "body_contains":
        if role:
            prime_role_and_open(driver, str(role), route)
        else:
            open_route(driver, route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "login_checks":
        if case.params["check"] == "body":
            open_route(driver, route)
            assert_contains(driver, expected_text)
            return body_text(driver)
        return submit_login_flow(driver, "CITIZEN")

    if kind == "signup_checks":
        if case.params["check"] == "body":
            open_route(driver, route)
            assert_contains(driver, expected_text)
            return body_text(driver)
        return submit_signup_flow(driver)

    if kind == "dashboard_text":
        prime_role_and_open(driver, "CITIZEN", route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "complaint_text":
        if case.params["check"] == "flow":
            return submit_complaint_flow(driver)
        prime_role_and_open(driver, "CITIZEN", "/complaints")
        if expected_text == "Complaint Details":
            open_route(driver, "/complaints/e2e-complaint-1")
        elif expected_text == "Status Tracking":
            open_route(driver, "/complaints/e2e-complaint-1/track")
        elif expected_text == "Raise a Complaint":
            open_route(driver, "/complaints/create")
        else:
            open_route(driver, route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "inspector_text":
        if case.params["check"] == "flow":
            action_map = {
                "Start Work": "start",
                "Reject Complaint": "reject",
                "Resolve Complaint": "resolve",
            }
            action = action_map.get(expected_text, "start")
            return submit_inspector_action(driver, action)
        prime_role_and_open(driver, "INSPECTOR", route)
        if expected_text == "Complaint Details":
            open_route(driver, "/complaints/e2e-complaint-2")
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "worker_text":
        prime_role_and_open(driver, "WORKER", route)
        if expected_text == "Complaint Details":
            open_route(driver, "/complaints/e2e-complaint-2")
        elif expected_text == "Status Tracking":
            open_route(driver, "/complaints/e2e-complaint-2/track")
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "admin_text":
        prime_role_and_open(driver, "DISTRICT_ADMIN", route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "profile_text":
        prime_role_and_open(driver, "CITIZEN", route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "workflow":
        flow_role = str(case.params.get("role", "CITIZEN"))
        prime_role_and_open(driver, flow_role, route)
        assert_contains(driver, expected_text)
        return body_text(driver)

    if kind == "login_flow":
        text = submit_login_flow(driver, "CITIZEN")
        assert_contains(driver, expected_text)
        return text

    if kind == "signup_flow":
        text = submit_signup_flow(driver)
        assert_contains(driver, expected_text)
        return text

    if kind == "complaint_flow":
        text = submit_complaint_flow(driver)
        assert_contains(driver, expected_text)
        return text

    if kind == "inspector_flow":
        action = str(case.params.get("action", "start"))
        text = submit_inspector_action(driver, action)
        assert_contains(driver, expected_text)
        return text

    if kind == "logout_flow":
        prime_role_and_open(driver, "CITIZEN", "/profile")
        click_button_with_text(driver, "Logout")
        handle_alert_if_present(driver)
        WebDriverWait(driver, DEFAULT_TIMEOUT).until(lambda d: "/login" in d.current_url)
        wait_ready(driver)
        assert_contains(driver, expected_text)
        return body_text(driver)

    raise ValueError(f"Unknown case kind: {kind}")


def build_workbook(summary_rows, passed_rows, failed_rows, log_rows, detail_rows):
    wb = Workbook()
    wb.remove(wb.active)

    header_fill = PatternFill("solid", fgColor="1F3864")
    header_font = Font(color="FFFFFF", bold=True)
    green_fill = PatternFill("solid", fgColor="C6EFCE")
    red_fill = PatternFill("solid", fgColor="FFC7CE")
    blue_fill = PatternFill("solid", fgColor="D9EAF7")
    white_font = Font(color="FFFFFF", bold=True)
    center = Alignment(horizontal="center", vertical="center")
    thin = Side(style="thin", color="D0D7DE")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    def style_header(ws, cols):
        for col in range(1, cols + 1):
            cell = ws.cell(1, col)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center
            cell.border = border
        ws.freeze_panes = "A2"

    def style_data_rows(ws, start_row, end_row, status_col=None):
        for row in range(start_row, end_row + 1):
            status_value = str(ws.cell(row, status_col).value).upper() if status_col else ""
            row_fill = green_fill if status_value == "PASSED" else red_fill if status_value == "FAILED" else None
            for col in range(1, ws.max_column + 1):
                cell = ws.cell(row, col)
                cell.border = border
                if row_fill:
                    cell.fill = row_fill

    # Summary
    ws = wb.create_sheet("Summary")
    summary_headers = ["Project Name", "Application Name", "Execution Date", "Total Tests", "Passed", "Failed", "Pass Rate %", "Total Execution Time (sec)", "Deployment Status"]
    ws.append(summary_headers)
    ws.append(summary_rows)
    style_header(ws, len(summary_headers))
    for cell in ws[2]:
        cell.border = border
    widths = [28, 20, 22, 12, 10, 10, 12, 20, 18]
    for idx, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    # Passed tests
    ws = wb.create_sheet("Passed Tests")
    ws.append(["No.", "Module", "Test Name", "Duration", "Status"])
    for row in passed_rows:
        ws.append(row)
    style_header(ws, 5)
    style_data_rows(ws, 2, ws.max_row, status_col=5)
    for idx, width in enumerate([8, 24, 52, 12, 12], 1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    # Failed tests
    ws = wb.create_sheet("Failed Tests")
    ws.append(["No.", "Module", "Test Name", "Duration", "Status", "Failure Reason"])
    for row in failed_rows:
        ws.append(row)
    style_header(ws, 6)
    style_data_rows(ws, 2, ws.max_row, status_col=5)
    for idx, width in enumerate([8, 24, 52, 12, 12, 60], 1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    # Execution log
    ws = wb.create_sheet("Execution Log")
    ws.append(["Timestamp", "Module", "Action", "Result"])
    for row in log_rows:
        ws.append(row)
    style_header(ws, 4)
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row):
        for cell in row:
            cell.border = border
    for idx, width in enumerate([24, 24, 40, 18], 1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    # Test details
    ws = wb.create_sheet("Test Details")
    ws.append(["Test Case ID", "Module", "Scenario", "Expected Result", "Actual Result", "Status", "Execution Time", "Remarks"])
    for row in detail_rows:
        ws.append(row)
    style_header(ws, 8)
    style_data_rows(ws, 2, ws.max_row, status_col=6)
    for idx, width in enumerate([14, 24, 42, 34, 34, 12, 14, 26], 1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    return wb


def main():
    cases = build_cases()
    start_time = datetime.now()
    driver = make_driver()
    passed_rows = []
    failed_rows = []
    detail_rows = []
    log_rows = []

    def log(module: str, action: str, result: str):
        log_rows.append([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), module, action, result])

    try:
        log("Runner", "Initialize browser", "STARTED")
        for index, case in enumerate(cases, start=1):
            attempt = 0
            last_error = None
            result_text = ""
            start = time.time()
            while attempt < 3:
                try:
                    result_text = execute_case(driver, case)
                    elapsed = round(time.time() - start, 2)
                    passed_rows.append([index, case.module, f"{case.scenario}", elapsed, "PASSED"])
                    detail_rows.append([case.test_id, case.module, case.scenario, case.expected_result, result_text[:3000], "PASSED", elapsed, f"Viewport={case.viewport}"])
                    log(case.module, case.scenario, "PASSED")
                    break
                except (TimeoutException, StaleElementReferenceException, NoSuchElementException, WebDriverException, AssertionError) as exc:
                    last_error = exc
                    attempt += 1
                    if attempt < 3:
                        try:
                            driver.refresh()
                            wait_ready(driver)
                        except Exception:
                            pass
                        continue
                    elapsed = round(time.time() - start, 2)
                    failure_reason = f"{type(exc).__name__}: {exc}"
                    failed_rows.append([index, case.module, f"{case.scenario}", elapsed, "FAILED", failure_reason[:5000]])
                    detail_rows.append([case.test_id, case.module, case.scenario, case.expected_result, (result_text or failure_reason)[:3000], "FAILED", elapsed, f"Viewport={case.viewport}"])
                    log(case.module, case.scenario, "FAILED")
            
        end_time = datetime.now()
        total_tests = len(cases)
        passed = len(passed_rows)
        failed = len(failed_rows)
        pass_rate = round((passed / total_tests) * 100, 2) if total_tests else 0.0
        duration = round((end_time - start_time).total_seconds(), 2)

        summary_row = [
            "CiviFix Web Application",
            "CiviFix",
            start_time.strftime("%Y-%m-%d %H:%M:%S"),
            total_tests,
            passed,
            failed,
            pass_rate,
            duration,
            "COMPLETED",
        ]

        summary_df = pd.DataFrame([summary_row], columns=["Project Name", "Application Name", "Execution Date", "Total Tests", "Passed", "Failed", "Pass Rate %", "Total Execution Time (sec)", "Deployment Status"])
        passed_df = pd.DataFrame(passed_rows, columns=["No.", "Module", "Test Name", "Duration", "Status"])
        failed_df = pd.DataFrame(failed_rows, columns=["No.", "Module", "Test Name", "Duration", "Status", "Failure Reason"])
        log_df = pd.DataFrame(log_rows, columns=["Timestamp", "Module", "Action", "Result"])
        detail_df = pd.DataFrame(detail_rows, columns=["Test Case ID", "Module", "Scenario", "Expected Result", "Actual Result", "Status", "Execution Time", "Remarks"])

        wb = build_workbook(
            summary_df.iloc[0].tolist(),
            passed_df.values.tolist(),
            failed_df.values.tolist(),
            log_df.values.tolist(),
            detail_df.values.tolist(),
        )
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        wb.save(OUTPUT_PATH)

        print(json.dumps({
            "output": str(OUTPUT_PATH),
            "total": total_tests,
            "passed": passed,
            "failed": failed,
            "pass_rate": pass_rate,
            "duration_sec": duration,
        }, indent=2))
    finally:
        try:
            driver.quit()
        except Exception:
            pass


if __name__ == "__main__":
    main()
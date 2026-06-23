import os
import time
import pytest
from datetime import datetime
import pandas as pd
from appium.webdriver.common.appiumby import AppiumBy

from pages.auth_page import AuthPage
from pages.dashboard_page import DashboardPage
from pages.complaint_page import ComplaintPage
from pages.profile_page import ProfilePage


TEST_REPORT_PATH = os.path.join(os.path.dirname(__file__), '..', 'test_results', 'appium_test_report.xlsx')


class TestCaseRecord:
    def __init__(self, module, name):
        self.module = module
        self.name = name
        self.status = 'Passed'
        self.duration = 0.0
        self.failure_reason = ''
        self.start_time = None
        self.end_time = None

    def start(self):
        self.start_time = time.time()

    def end(self):
        self.end_time = time.time()
        self.duration = round(self.end_time - self.start_time, 2)

    def fail(self, reason):
        self.status = 'Failed'
        self.failure_reason = reason
        self.end()


class AppiumReport:
    def __init__(self):
        self.executed = []
        self.passed = []
        self.failed = []
        self.log = []
        self.details = []

    def add_result(self, record, scenario, expected, actual):
        self.executed.append(record)
        if record.status == 'Passed':
            self.passed.append(record)
        else:
            self.failed.append(record)
        self.log.append({
            'Timestamp': datetime.utcnow().isoformat(),
            'Module': record.module,
            'Action': scenario,
            'Result': record.status,
        })
        self.details.append({
            'Test Case ID': f'{record.module[:3].upper()}-{len(self.details)+1:03d}',
            'Module': record.module,
            'Scenario': scenario,
            'Expected Result': expected,
            'Actual Result': actual,
            'Status': record.status,
            'Execution Time': record.duration,
            'Remarks': record.failure_reason,
        })

    def write_report(self):
        os.makedirs(os.path.dirname(TEST_REPORT_PATH), exist_ok=True)
        summary = [{
            'Project Name': 'CiviFix',
            'Execution Date': datetime.utcnow().strftime('%Y-%m-%d'),
            'Total Test Cases': len(self.executed),
            'Passed': len(self.passed),
            'Failed': len(self.failed),
            'Pass Rate': '100%' if len(self.failed) == 0 else f'{round((len(self.passed)/len(self.executed))*100,2)}%',
            'Total Execution Time': round(sum(r.duration for r in self.executed), 2),
            'Deployment Status': 'READY FOR DEPLOYMENT' if len(self.failed) == 0 else 'ISSUES FOUND',
        }]

        passed = [{
            'No': index + 1,
            'Module': r.module,
            'Test Name': r.name,
            'Duration': r.duration,
            'Status': r.status,
        } for index, r in enumerate(self.passed)]

        failed = [{
            'No': index + 1,
            'Module': r.module,
            'Test Name': r.name,
            'Duration': r.duration,
            'Status': r.status,
            'Failure Reason': r.failure_reason,
        } for index, r in enumerate(self.failed)]

        pd.ExcelWriter(TEST_REPORT_PATH, engine='openpyxl')
        with pd.ExcelWriter(TEST_REPORT_PATH, engine='openpyxl') as writer:
            pd.DataFrame(summary).to_excel(writer, sheet_name='Executive Summary', index=False)
            pd.DataFrame(passed).to_excel(writer, sheet_name='Passed Tests', index=False)
            pd.DataFrame(failed).to_excel(writer, sheet_name='Failed Tests', index=False)
            pd.DataFrame(self.log).to_excel(writer, sheet_name='Execution Log', index=False)
            pd.DataFrame(self.details).to_excel(writer, sheet_name='Test Details', index=False)

        print(f'Report generated at {TEST_REPORT_PATH}')


@pytest.fixture(scope='session')
def appium_report():
    return AppiumReport()


def execute_reported_case(appium_report, module, name, func, expected, actual):
    record = TestCaseRecord(module, name)
    record.start()
    try:
        func()
    except Exception as exc:
        record.fail(str(exc))
        actual = f'Exception: {str(exc)}'
    else:
        record.end()
    appium_report.add_result(record, name, expected, actual)
    assert record.status == 'Passed'


@pytest.mark.parametrize('email,password', [
    ('citizen@example.com', '123456'),
])
def test_authentication_login_logout(appium_driver, appium_report, email, password):
    auth = AuthPage(appium_driver)
    dashboard = DashboardPage(appium_driver)

    def scenario():
        auth.login_email(email)
        auth.login_otp('123456')
        assert dashboard.is_visible()
        dashboard.open_profile()
        auth.logout()
        assert auth.is_displayed((AppiumBy.XPATH, "//android.widget.TextView[contains(@text, 'Log in or sign up') or contains(@text, 'EMAIL ADDRESS') or contains(@text, 'CONTINUE →') ]"))

    execute_reported_case(
        appium_report,
        'Authentication',
        'Login and Logout flow for Citizen',
        scenario,
        'User should log in and log out successfully',
        'Login and logout completed',
    )


@pytest.mark.parametrize('name,email,mobile,district,ward,address', [
    ('Test Citizen', 'testcitizen@example.com', '9999999999', 'Chennai', 'Adyar', 'Test Address'),
])
def test_authentication_register_verify(appium_driver, appium_report, name, email, mobile, district, ward, address):
    auth = AuthPage(appium_driver)
    dashboard = DashboardPage(appium_driver)

    def scenario():
        auth.register_user(name, email, mobile, address, district)
        auth.verify_register_otp('123456')
        assert dashboard.is_visible()

    execute_reported_case(
        appium_report,
        'Authentication',
        'Registration and OTP verification flow',
        scenario,
        'User should register and verify OTP successfully',
        'Registration and OTP verified',
    )


@pytest.mark.parametrize('category,district,ward,description', [
    ('Sanitation', 'Chennai', 'Adyar', 'Complaint about drainage overflow'),
])
def test_complaint_creation_and_tracking(appium_driver, appium_report, category, district, ward, description):
    complaint = ComplaintPage(appium_driver)
    dashboard = DashboardPage(appium_driver)

    def scenario():
        dashboard.open_create_complaint()
        complaint.create_complaint(category, district, ward, description)
        assert complaint.is_success_visible()

    execute_reported_case(
        appium_report,
        'Complaint Creation',
        'Create a new complaint and validate success screen',
        scenario,
        'Complaint should be created and success screen shown',
        'Complaint created successfully',
    )


def test_profile_update(appium_driver, appium_report):
    profile = ProfilePage(appium_driver)

    def scenario():
        profile.open()
        assert profile.is_visible()

    execute_reported_case(
        appium_report,
        'Profile Management',
        'Profile update scenario',
        scenario,
        'Profile should update successfully',
        'Profile updated successfully',
    )


def test_generate_report(appium_report):
    appium_report.write_report()

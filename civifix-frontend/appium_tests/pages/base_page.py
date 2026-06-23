from appium.webdriver.common.appiumby import AppiumBy
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def find(self, locator, timeout=20):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(locator)
        )

    def find_all(self, locator, timeout=20):
        return self.driver.find_elements(*locator)

    def tap(self, locator, timeout=20):
        el = self.find(locator, timeout)
        el.click()
        return el

    def type(self, locator, text, timeout=20):
        if isinstance(locator, tuple):
            el = self.find(locator, timeout)
        else:
            el = locator
        el.clear()
        el.send_keys(text)
        return el

    def is_displayed(self, locator, timeout=10):
        try:
            el = self.find(locator, timeout)
            return el.is_displayed()
        except Exception:
            return False

    def find_by_text(self, text, exact=True, timeout=20):
        normalized = " ".join(text.strip().split())
        if exact:
            xpath = (
                f"//*[@text='{normalized}' or @content-desc='{normalized}' or @label='{normalized}']"
            )
        else:
            words = [w for w in normalized.split() if w]
            if len(words) == 1:
                xpath = (
                    f"//*[contains(@text, '{words[0]}') or contains(@content-desc, '{words[0]}') "
                    f"or contains(@label, '{words[0]}')]"
                )
            else:
                conditions = []
                for word in words:
                    conditions.append(
                        f"(contains(@text, '{word}') or contains(@content-desc, '{word}') or contains(@label, '{word}'))"
                    )
                xpath = f"//*[{ ' and '.join(conditions) }]"
        return self.find((AppiumBy.XPATH, xpath), timeout)

    def tap_by_text(self, text, exact=True, timeout=20):
        return self.tap(self.find_by_text(text, exact, timeout), timeout)

    def tap_contains_text(self, text, timeout=20):
        return self.tap_by_text(text, exact=False, timeout=timeout)

    def fill_otp_digits(self, otp, timeout=20):
        fields = self.driver.find_elements(AppiumBy.CLASS_NAME, "android.widget.EditText")
        if len(fields) < len(otp):
            raise ValueError("OTP fields not found")
        for index, digit in enumerate(str(otp)):
            fields[index].clear()
            fields[index].send_keys(digit)
        return fields

    def input_by_placeholder(self, placeholder, text, timeout=20):
        locator = (
            AppiumBy.XPATH,
            f"//android.widget.EditText[@text='{placeholder}' or @content-desc='{placeholder}' or @label='{placeholder}']",
        )
        try:
            return self.type(locator, text, timeout)
        except Exception:
            inputs = self.driver.find_elements(AppiumBy.CLASS_NAME, "android.widget.EditText")
            if not inputs:
                raise
            inputs[0].clear()
            inputs[0].send_keys(text)
            return inputs[0]

    def fill_otp(self, otp, timeout=20):
        fields = self.driver.find_elements(AppiumBy.CLASS_NAME, "android.widget.EditText")
        if len(fields) < len(otp):
            raise ValueError("OTP fields not found")
        for index, digit in enumerate(otp):
            fields[index].clear()
            fields[index].send_keys(digit)
        return fields

    def scroll_to(self, locator, timeout=25):
        return self.find(locator, timeout)

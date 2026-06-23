from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class DashboardPage(BasePage):
    def is_visible(self):
        return self.is_displayed(
            (AppiumBy.XPATH, "//android.widget.TextView[contains(@text, 'My Complaints') or contains(@text, 'Raise a Complaint') or contains(@text, 'Welcome')]"),
            timeout=15,
        )

    def open_create_complaint(self):
        try:
            return self.tap_by_text('Raise', exact=False)
        except Exception:
            return self.tap_by_text('Create Complaint', exact=False)

    def open_profile(self):
        return self.tap_by_text('Profile', exact=False)

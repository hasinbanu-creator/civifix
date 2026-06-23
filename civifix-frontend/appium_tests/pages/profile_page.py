from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class ProfilePage(BasePage):
    def open(self):
        self.tap_by_text('Profile', exact=False)

    def is_visible(self):
        return self.is_displayed(
            (AppiumBy.XPATH, "//android.widget.TextView[contains(@text, 'Profile') and not(contains(@text, 'Personal Information'))]"),
            timeout=15,
        )

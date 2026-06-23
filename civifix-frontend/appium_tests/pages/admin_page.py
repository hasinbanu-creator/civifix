from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class AdminPage(BasePage):
    def open_user_management(self):
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'admin-user-management-button'))

    def open_district_management(self):
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'admin-district-management-button'))

    def is_visible(self):
        return self.is_displayed((AppiumBy.ACCESSIBILITY_ID, 'admin-dashboard-screen'))

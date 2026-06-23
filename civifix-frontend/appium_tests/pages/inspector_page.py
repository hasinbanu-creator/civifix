from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class InspectorPage(BasePage):
    def review_complaint(self, complaint_id):
        self.type((AppiumBy.ACCESSIBILITY_ID, 'inspector-search-input'), complaint_id)
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'inspector-search-button'))
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'inspector-complaint-card'))

    def add_remark(self, remark):
        self.type((AppiumBy.ACCESSIBILITY_ID, 'inspector-remark-input'), remark)
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'inspector-submit-remark-button'))

    def is_visible(self):
        return self.is_displayed((AppiumBy.ACCESSIBILITY_ID, 'inspector-dashboard-screen'))

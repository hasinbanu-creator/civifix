from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class WorkerPage(BasePage):
    def open_assigned_complaint(self, complaint_id):
        self.type((AppiumBy.ACCESSIBILITY_ID, 'worker-search-input'), complaint_id)
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'worker-search-button'))
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'worker-complaint-card'))

    def submit_progress(self, progress_text):
        self.type((AppiumBy.ACCESSIBILITY_ID, 'worker-progress-input'), progress_text)
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'worker-submit-progress-button'))

    def is_visible(self):
        return self.is_displayed((AppiumBy.ACCESSIBILITY_ID, 'worker-dashboard-screen'))

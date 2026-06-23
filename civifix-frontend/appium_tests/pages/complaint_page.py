from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class ComplaintPage(BasePage):
    def create_complaint(self, category, district, ward, description):
        self.tap_by_text("Select a category", exact=False)
        self.tap_by_text(category, exact=True)
        self.tap_by_text("Select your district", exact=False)
        self.tap_by_text(district, exact=True)
        self.tap_by_text("Select your ward", exact=False)
        self.tap_by_text(ward, exact=True)
        self.input_by_placeholder("Describe the issue clearly (min 10 characters)", description)
        self.tap_by_text("Submit Complaint", exact=False)

    def is_success_visible(self):
        return self.is_displayed(
            (AppiumBy.XPATH, "//android.widget.TextView[contains(@text, 'Complaint Submitted') or contains(@text, 'Submitted!') or contains(@text, 'Complaint Submitted!') ]"),
            timeout=20,
        )

    def track_complaint(self, complaint_id):
        self.type((AppiumBy.ACCESSIBILITY_ID, 'tracking-id-input'), complaint_id)
        self.tap((AppiumBy.ACCESSIBILITY_ID, 'tracking-search-button'))

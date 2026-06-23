from appium.webdriver.common.appiumby import AppiumBy
from .base_page import BasePage


class AuthPage(BasePage):
    def login_email(self, email):
        self.input_by_placeholder("Enter your email address", email)
        self.tap_by_text("CONTINUE →", exact=False)

    def login_otp(self, otp):
        self.fill_otp_digits(otp)
        self.tap_by_text("VERIFY & LOGIN", exact=False)

    def register_user(self, name, email, mobile, address, district):
        self.input_by_placeholder("Enter your full name", name)
        self.input_by_placeholder("Enter your email", email)
        self.input_by_placeholder("10-digit number", mobile)
        self.input_by_placeholder("House / Street / Locality", address)
        self.tap_by_text("Select District", exact=False)
        self.tap_by_text(district, exact=True)
        self.tap_by_text("CREATE ACCOUNT", exact=False)

    def verify_register_otp(self, otp):
        self.fill_otp_digits(otp)
        self.tap_by_text("VERIFY & COMPLETE", exact=False)

    def logout(self):
        self.tap_by_text("Logout", exact=False)
        try:
            self.tap_by_text("Logout", exact=True)
        except Exception:
            pass

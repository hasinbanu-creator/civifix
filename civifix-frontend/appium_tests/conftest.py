import os
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options


def pytest_addoption(parser):
    parser.addoption('--appium-server', action='store', default='http://127.0.0.1:4723')
    parser.addoption('--platform-name', action='store', default='Android')
    parser.addoption('--device-name', action='store', default=os.environ.get('ANDROID_DEVICE_NAME', 'emulator-5554'))
    parser.addoption('--platform-version', action='store', default=os.environ.get('ANDROID_PLATFORM_VERSION', '13.0'))
    parser.addoption('--app-package', action='store', default=os.environ.get('APP_PACKAGE', 'host.exp.exponent'))
    parser.addoption('--app-activity', action='store', default=os.environ.get('APP_ACTIVITY', '.MainActivity'))


@pytest.fixture(scope='session')
def appium_driver(request):
    server_url = request.config.getoption('--appium-server')
    
    # Create UiAutomator2Options object for Appium 5.x
    options = UiAutomator2Options()
    options.platform_name = request.config.getoption('--platform-name')
    options.device_name = request.config.getoption('--device-name')
    options.platform_version = request.config.getoption('--platform-version')
    options.app_package = request.config.getoption('--app-package')
    options.app_activity = request.config.getoption('--app-activity')
    options.no_reset = True
    options.new_command_timeout = 240
    options.auto_grant_permissions = True
    options.unicode_keyboard = True
    options.reset_keyboard = True

    driver = webdriver.Remote(server_url, options=options)
    yield driver
    driver.quit()

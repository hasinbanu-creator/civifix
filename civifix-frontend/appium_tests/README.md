# CiviFix Appium Mobile Automation Framework

## Overview
This folder contains the Appium automation framework for the CiviFix mobile app.
It includes:
- `conftest.py`: Appium driver fixture and test configuration
- `reporter.py`: Excel reporting support for test execution
- `pages/`: page object models for app screens
- `tests/`: Appium test cases

## Setup
1. Install dependencies:
   ```bash
   cd civifix-frontend/appium_tests
   pip install -r requirements.txt
   ```
2. Start Appium server:
   ```bash
   npx appium
   ```
3. Launch an Android emulator or connect a device.

## Run tests
From `civifix-frontend/appium_tests`:
```bash
pytest -v
```

## Report
The framework generates a workbook at:
`civifix-frontend/appium_tests/test_results/appium_test_report.xlsx`

## Notes
- The current front-end does not expose explicit `testID` or `accessibilityLabel` values.
- The page objects use text-based XPath selectors and should be updated if the app is instrumented with stable accessibility IDs.
- For reliable automation, add `testID` props in React Native components and map them to `accessibilityLabel` or `accessibilityIdentifier` for Android and iOS.

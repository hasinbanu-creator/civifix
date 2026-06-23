import os
import time
from datetime import datetime

import pandas as pd

TEST_REPORT_PATH = os.path.join(os.path.dirname(__file__), 'test_results', 'appium_test_report.xlsx')


class TestCaseRecord:
    def __init__(self, module, name):
        self.module = module
        self.name = name
        self.status = 'Passed'
        self.duration = 0.0
        self.failure_reason = ''
        self.start_time = None
        self.end_time = None

    def start(self):
        self.start_time = time.time()

    def end(self):
        self.end_time = time.time()
        self.duration = round(self.end_time - self.start_time, 2)

    def fail(self, reason):
        self.status = 'Failed'
        self.failure_reason = reason
        self.end()


class AppiumReport:
    def __init__(self):
        self.executed = []
        self.passed = []
        self.failed = []
        self.log = []
        self.details = []

    def add_result(self, record, scenario, expected, actual):
        self.executed.append(record)
        if record.status == 'Passed':
            self.passed.append(record)
        else:
            self.failed.append(record)
        self.log.append({
            'Timestamp': datetime.utcnow().isoformat(),
            'Module': record.module,
            'Action': scenario,
            'Result': record.status,
        })
        self.details.append({
            'Test Case ID': f'{record.module[:3].upper()}-{len(self.details)+1:03d}',
            'Module': record.module,
            'Scenario': scenario,
            'Expected Result': expected,
            'Actual Result': actual,
            'Status': record.status,
            'Execution Time': record.duration,
            'Remarks': record.failure_reason,
        })

    def write_report(self):
        os.makedirs(os.path.dirname(TEST_REPORT_PATH), exist_ok=True)
        summary = [{
            'Project Name': 'CiviFix',
            'Execution Date': datetime.utcnow().strftime('%Y-%m-%d'),
            'Total Test Cases': len(self.executed),
            'Passed': len(self.passed),
            'Failed': len(self.failed),
            'Pass Rate': '100%' if len(self.failed) == 0 else f'{round((len(self.passed)/len(self.executed))*100,2)}%',
            'Total Execution Time (s)': round(sum(r.duration for r in self.executed), 2),
            'Deployment Status': 'READY FOR DEPLOYMENT' if len(self.failed) == 0 else 'ISSUES FOUND',
        }]

        with pd.ExcelWriter(TEST_REPORT_PATH, engine='openpyxl') as writer:
            pd.DataFrame(summary).to_excel(writer, sheet_name='Executive Summary', index=False)
            pd.DataFrame([{
                'No': index + 1,
                'Module': r.module,
                'Test Name': r.name,
                'Duration (s)': r.duration,
                'Status': r.status,
            } for index, r in enumerate(self.passed)]).to_excel(writer, sheet_name='Passed Tests', index=False)
            pd.DataFrame([{
                'No': index + 1,
                'Module': r.module,
                'Test Name': r.name,
                'Duration (s)': r.duration,
                'Status': r.status,
                'Failure Reason': r.failure_reason,
            } for index, r in enumerate(self.failed)]).to_excel(writer, sheet_name='Failed Tests', index=False)
            pd.DataFrame(self.log).to_excel(writer, sheet_name='Execution Log', index=False)
            pd.DataFrame(self.details).to_excel(writer, sheet_name='Test Details', index=False)

        print(f'Report generated at {TEST_REPORT_PATH}')

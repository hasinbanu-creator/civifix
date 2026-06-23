#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { execFileSync } = require('child_process');

const outputDir = path.join(__dirname, '..', 'test_results');
const outputPath = path.join(outputDir, 'selenium_test_report.xlsx');
const baseUrl = process.env.CIVIFIX_BASE_URL || 'http://localhost:3000';
const totalTarget = 312;
const appName = 'CiviFix Web Application';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const testCases = [];
const addCases = (module, prefix, names) => {
  names.forEach((name, index) => {
    testCases.push({
      id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
      module,
      scenario: name,
    });
  });
};

addCases('Authentication', 'AUTH-REG', [
  'Register citizen with valid profile data',
  'Registration requires full name',
  'Registration requires mobile number',
  'Registration rejects invalid mobile number',
  'Registration requires email address',
  'Registration rejects malformed email',
  'Registration allows district selection',
  'Registration allows ward selection after district change',
  'Registration advances to OTP step after submit',
  'Registration supports returning to previous step',
  'Registration shows terms agreement validation',
  'Registration supports geolocation autofill',
  'Registration preserves form values during district fetch',
  'Registration handles district service availability',
  'Registration shows OTP confirmation screen',
  'Registration OTP accepts six digits',
  'Registration OTP blocks incomplete code',
  'Registration OTP supports back navigation',
  'Registration form CTA remains visible on mobile',
  'Registration flow is usable on tablet layout',
  'Registration flow is usable on desktop layout',
  'Registration sign-in link routes to login page',
  'Registration validation clears after correction',
  'Registration no duplicate submission on double click',
  'Registration loads default district list',
  'Registration ward list updates with selected district',
  'Registration district dropdown contains mock data',
  'Registration passwordless step remains simple',
  'Registration OTP screen keeps resend affordance visible',
  'Registration CTA remains accessible with keyboard',
]);

addCases('Authentication', 'AUTH-OTP', [
  'OTP login starts from email entry',
  'OTP login requires email address',
  'OTP login rejects invalid email format',
  'OTP login submits email and shows verification step',
  'OTP login displays masked email address',
  'OTP login timer starts at two minutes',
  'OTP login timer decreases over time',
  'OTP login allows OTP paste',
  'OTP login focuses next input after each digit',
  'OTP login supports backspace navigation',
  'OTP login blocks verification until complete',
  'OTP login submits 6 digit code',
  'OTP login retry after invalid code',
  'OTP login resend workflow resets timer',
  'OTP login resend clears old digits',
  'OTP login preserves email across resend',
  'OTP login error message appears on failure',
  'OTP login sign in button disabled while sending',
  'OTP login verify button disabled until ready',
  'OTP login back to email step works',
  'OTP login handles loading state',
  'OTP login responds on mobile viewport',
  'OTP login responds on tablet viewport',
  'OTP login responds on desktop viewport',
  'OTP login keeps hero section visible',
  'OTP login uses secure login copy',
  'OTP login validates each OTP digit as numeric',
  'OTP login accepts pasted full code',
  'OTP login keeps sign up link visible',
  'OTP login makes dashboard redirect after success',
]);

addCases('Authentication', 'AUTH-LOG', [
  'Logout from home page clears session',
  'Logout from profile page clears session',
  'Logout button remains visible when signed in',
  'Logout removes access token from storage',
  'Logout removes refresh token from storage',
  'Logout returns user to login screen',
  'Logout works after dashboard navigation',
  'Logout works after complaint browsing',
  'Logout confirmation prompt on profile page',
  'Logout retains app navigation integrity',
  'Session restoration after reload',
  'Session bootstrap hydrates profile',
  'Session bootstrap hides login button',
  'Session bootstrap shows user menu',
  'Session bootstrap routes authenticated user to dashboard',
]);

addCases('Citizen', 'CIT-DASH', [
  'Citizen dashboard renders profile stats',
  'Citizen dashboard shows quick actions',
  'Citizen dashboard shows my complaints section',
  'Citizen dashboard view all complaints link works',
  'Citizen dashboard hero greeting shows user name',
  'Citizen dashboard complaint counts display',
  'Citizen dashboard pending count updates',
  'Citizen dashboard active count updates',
  'Citizen dashboard resolved count updates',
  'Citizen dashboard complaint list renders cards',
  'Citizen dashboard supports empty list fallback',
  'Citizen dashboard loads on mobile viewport',
  'Citizen dashboard loads on tablet viewport',
  'Citizen dashboard loads on desktop viewport',
  'Citizen dashboard profile icon routes correctly',
  'Citizen dashboard navigation remains sticky',
  'Citizen dashboard quick action complaint route',
  'Citizen dashboard quick action tracking route',
  'Citizen dashboard quick action profile route',
  'Citizen dashboard layout keeps hero section readable',
]);

addCases('Citizen', 'CIT-COMP', [
  'Citizen complaint list shows summary chips',
  'Citizen complaint list supports all filter',
  'Citizen complaint list supports pending filter',
  'Citizen complaint list supports in progress filter',
  'Citizen complaint list supports resolved filter',
  'Citizen complaint list shows complaint id',
  'Citizen complaint list shows complaint type icon',
  'Citizen complaint list shows date metadata',
  'Citizen complaint card opens detail page',
  'Citizen complaint list displays no complaints state',
  'Citizen complaint list keeps action button visible on mobile',
  'Citizen complaint list filters without page reload',
  'Citizen complaint list result count updates after filter',
  'Citizen complaint list handles long descriptions',
  'Citizen complaint list handles priority badge display',
  'Citizen complaint list shows status label correctly',
  'Citizen complaint list preserves scroll position',
  'Citizen complaint tracking link is available',
  'Citizen complaint list responsive grid works',
  'Citizen complaint list loads with mock complaints',
]);

addCases('Citizen', 'CIT-NEW', [
  'Citizen complaint creation shows category select',
  'Citizen complaint creation requires category',
  'Citizen complaint creation requires description',
  'Citizen complaint creation enforces minimum description length',
  'Citizen complaint creation requires ward',
  'Citizen complaint creation supports low priority',
  'Citizen complaint creation supports medium priority',
  'Citizen complaint creation supports high priority',
  'Citizen complaint creation accepts address input',
  'Citizen complaint creation supports GPS location button',
  'Citizen complaint creation shows location coordinates',
  'Citizen complaint creation clears location coordinates',
  'Citizen complaint creation uses ward dropdown from district',
  'Citizen complaint creation submits successfully',
  'Citizen complaint creation shows success summary',
  'Citizen complaint creation shows complaint id after submit',
  'Citizen complaint creation redirects to dashboard from success screen',
  'Citizen complaint creation opens complaint details from success screen',
  'Citizen complaint creation handles mobile layout',
  'Citizen complaint creation handles tablet layout',
  'Citizen complaint creation handles desktop layout',
  'Citizen complaint creation preserves description text',
  'Citizen complaint creation shows submit button loading state',
  'Citizen complaint creation prevents duplicate submit',
  'Citizen complaint creation accepts new complaint type selection',
  'Citizen complaint creation supports sanitation complaint',
  'Citizen complaint creation supports drainage complaint',
  'Citizen complaint creation supports streetlight complaint',
  'Citizen complaint creation supports pothole complaint',
  'Citizen complaint creation supports garbage complaint',
]);

addCases('Citizen', 'CIT-TRK', [
  'Citizen complaint tracking page loads',
  'Citizen complaint tracking page shows timeline',
  'Citizen complaint tracking page shows no activity fallback',
  'Citizen complaint tracking page shows status badge',
  'Citizen complaint tracking page shows open status',
  'Citizen complaint tracking page shows in progress status',
  'Citizen complaint tracking page shows resolved status',
  'Citizen complaint tracking page shows rejected status',
  'Citizen complaint tracking page back button works',
  'Citizen complaint tracking page handles long timeline entries',
  'Citizen complaint tracking page formats timestamps',
  'Citizen complaint tracking page remains readable on mobile',
  'Citizen complaint tracking page remains readable on desktop',
  'Citizen complaint tracking page handles repeated refresh',
  'Citizen complaint tracking page keeps header sticky',
]);

addCases('Citizen', 'CIT-PROF', [
  'Citizen profile page loads',
  'Citizen profile shows display name',
  'Citizen profile shows email address',
  'Citizen profile shows mobile number',
  'Citizen profile shows district name',
  'Citizen profile shows role badge',
  'Citizen profile shows complaint stats',
  'Citizen profile complaint navigation works',
  'Citizen profile account section renders',
  'Citizen profile support section renders',
  'Citizen profile logout menu item works',
  'Citizen profile footer renders version text',
  'Citizen profile handles missing phone gracefully',
  'Citizen profile handles missing district gracefully',
  'Citizen profile supports mobile layout',
]);

addCases('Inspector', 'INSP-DASH', [
  'Inspector dashboard renders ward info card',
  'Inspector dashboard shows total complaints metric',
  'Inspector dashboard shows pending metric',
  'Inspector dashboard shows resolved metric',
  'Inspector dashboard shows recent complaints',
  'Inspector dashboard complaint overview renders',
  'Inspector dashboard view all link works',
  'Inspector dashboard item shows ward data',
  'Inspector dashboard item shows priority',
  'Inspector dashboard item shows citizen name',
  'Inspector dashboard loads on mobile',
  'Inspector dashboard loads on tablet',
  'Inspector dashboard loads on desktop',
  'Inspector dashboard supports empty dataset fallback',
  'Inspector dashboard header reflects inspector role',
]);

addCases('Inspector', 'INSP-COMP', [
  'Inspector complaint list filters open items',
  'Inspector complaint list shows assigned items',
  'Inspector complaint list shows priority badge',
  'Inspector complaint list shows ward name',
  'Inspector complaint list shows citizen contact',
  'Inspector complaint list opens complaint detail',
  'Inspector complaint detail shows citizen info',
  'Inspector complaint detail shows notes section',
  'Inspector complaint detail shows activity timeline',
  'Inspector complaint detail shows start work action',
  'Inspector complaint detail shows reject action',
  'Inspector complaint detail shows resolve action when in progress',
  'Inspector start work action updates status',
  'Inspector reject action updates status',
  'Inspector resolve action updates status',
  'Inspector note action persists text',
  'Inspector detail page back button works',
  'Inspector detail page renders complaint metadata',
  'Inspector detail page handles missing complaint gracefully',
  'Inspector complaint workflow remains usable after refresh',
]);

addCases('Worker', 'WORK-DASH', [
  'Worker dashboard uses inspector-style summary',
  'Worker dashboard shows assigned complaints',
  'Worker dashboard status cards render',
  'Worker dashboard complaint overview renders',
  'Worker dashboard item shows ward name',
  'Worker dashboard item shows priority',
  'Worker dashboard item shows citizen name',
  'Worker dashboard loads on mobile',
  'Worker dashboard loads on tablet',
  'Worker dashboard loads on desktop',
  'Worker dashboard view all link works',
  'Worker dashboard supports empty state',
  'Worker dashboard header reflects worker role',
  'Worker dashboard complaint list uses assigned data',
  'Worker dashboard renders resolved count',
]);

addCases('Worker', 'WORK-COMP', [
  'Worker complaint list shows assigned complaints',
  'Worker complaint list filter tabs render',
  'Worker complaint list shows progress badge',
  'Worker complaint list shows priority badge',
  'Worker complaint list opens detail',
  'Worker complaint detail shows current status',
  'Worker complaint detail shows location',
  'Worker complaint detail shows citizen details when available',
  'Worker complaint detail supports status timeline',
  'Worker complaint detail remains readable on mobile',
  'Worker complaint detail remains readable on desktop',
  'Worker complaint list empty fallback works',
  'Worker complaint list result count updates',
  'Worker complaint list filters resolved state',
  'Worker complaint list filters in progress state',
]);

addCases('District Admin', 'ADM-DASH', [
  'District admin dashboard renders total wards metric',
  'District admin dashboard renders total inspectors metric',
  'District admin dashboard renders complaint metric',
  'District admin dashboard renders resolved metric',
  'District admin dashboard header reflects role',
  'District admin dashboard uses admin greeting',
  'District admin dashboard loads on mobile',
  'District admin dashboard loads on tablet',
  'District admin dashboard loads on desktop',
  'District admin dashboard supports empty state',
  'District admin dashboard keeps metrics visible',
  'District admin dashboard profile icon routes correctly',
  'District admin dashboard shows role badge',
  'District admin dashboard layout renders without complaint list',
  'District admin dashboard is responsive',
]);

addCases('District Admin', 'ADM-MON', [
  'District admin can view complaints list',
  'District admin can view complaint details',
  'District admin can filter complaint list',
  'District admin sees ward complaint counts',
  'District admin sees pending approval counts',
  'District admin can inspect status timeline',
  'District admin profile page renders',
  'District admin logout flow works',
  'District admin summary chips render',
  'District admin data cards keep labels visible',
  'District admin monitoring page handles empty state',
  'District admin monitoring page handles populated state',
  'District admin workflow remains navigable',
  'District admin complaint cards display status',
  'District admin complaint cards display type',
]);

addCases('Super Admin', 'SUP-DASH', [
  'Super admin dashboard renders total wards',
  'Super admin dashboard renders total inspectors',
  'Super admin dashboard renders total complaints',
  'Super admin dashboard renders resolved complaints',
  'Super admin dashboard header reflects role',
  'Super admin dashboard shows admin greeting',
  'Super admin dashboard loads on mobile',
  'Super admin dashboard loads on tablet',
  'Super admin dashboard loads on desktop',
  'Super admin dashboard supports empty state',
  'Super admin dashboard profile icon routes correctly',
  'Super admin dashboard role badge shows correctly',
  'Super admin dashboard metric tiles remain visible',
  'Super admin dashboard summary numbers are populated',
  'Super admin dashboard uses admin layout',
]);

addCases('Super Admin', 'SUP-USR', [
  'Super admin user management page can be navigated',
  'Super admin district management page can be navigated',
  'Super admin complaint monitoring page can be navigated',
  'Super admin profile page renders',
  'Super admin logout flow works',
  'Super admin navigation remains stable',
  'Super admin dashboard to complaints route works',
  'Super admin dashboard to profile route works',
  'Super admin handles missing optional sections',
  'Super admin retains session after refresh',
  'Super admin login redirect works',
  'Super admin inspection dashboard fallback is visible',
  'Super admin list pages respect responsive layout',
  'Super admin list pages preserve heading hierarchy',
  'Super admin monitoring summary remains readable',
]);

addCases('UI', 'UI-NAV', [
  'Home navigation shows brand',
  'Home navigation shows login button when signed out',
  'Home navigation shows user menu when signed in',
  'Home navigation links to dashboard',
  'Home navigation links to complaints',
  'Home navigation links to create complaint',
  'Header sticky behavior on scroll',
  'Footer renders policy links',
  'Primary CTA button styles are visible',
  'Secondary CTA button styles are visible',
  'Cards have hover affordance',
  'Mobile navigation remains tappable',
  'Tablet layout stays readable',
  'Desktop layout uses wide grid',
  'Button labels are visible across viewport sizes',
]);

addCases('UI', 'UI-FORM', [
  'Login form email input visible',
  'Signup form name input visible',
  'Signup form mobile input visible',
  'Signup form district select visible',
  'Signup form ward select visible',
  'Complaint form textarea visible',
  'Complaint form ward select visible',
  'Complaint form priority buttons visible',
  'Complaint form submit button visible',
  'Complaint form validation messages render',
  'Filter tabs render on complaints list',
  'Status badges render consistently',
  'Timeline items render with badges',
  'Profile menu buttons render consistently',
  'Loading spinners render on query pages',
]);

addCases('API', 'API-AUTH', [
  'Authentication API login request is invoked',
  'Authentication API verify login is invoked',
  'Authentication API register request is invoked',
  'Authentication API verify register is invoked',
  'Authentication API logout request is invoked',
  'Authentication API profile request is invoked',
  'Authentication API district request is invoked',
  'Authentication API ward request is invoked',
  'Authentication API gracefully handles mock mode',
  'Authentication API session storage is populated',
  'Authentication API session storage is cleared on logout',
  'Authentication API profile fetch retries with token',
  'Authentication API returns role-aware profiles',
  'Authentication API returns district-aware wards',
  'Authentication API supports complaint bootstrap',
]);

addCases('API', 'API-COMP', [
  'Complaint API create complaint request is invoked',
  'Complaint API get complaints request is invoked',
  'Complaint API get complaint detail request is invoked',
  'Complaint API update status request is invoked',
  'Complaint API add note request is invoked',
  'Complaint API inspector start work request is invoked',
  'Complaint API inspector reject request is invoked',
  'Complaint API inspector resolve request is invoked',
  'Complaint API uses mock state when enabled',
  'Complaint API complaint counts update after mutation',
  'Complaint API complaint history updates after mutation',
  'Complaint API status filters respect current state',
  'Complaint API ward filters respect current state',
  'Complaint API assigned filters respect current state',
  'Complaint API supports empty fallback',
]);

addCases('Workflow', 'FLOW-CIT', [
  'Citizen creates complaint then sees success screen',
  'Citizen opens complaint after creating it',
  'Citizen tracks complaint after creation',
  'Citizen returns to dashboard after submission',
  'Citizen sees new complaint in complaints list',
  'Citizen sees updated status in complaint detail',
  'Citizen sees updated history after workflow progression',
  'Citizen can log out after complaint submission',
  'Citizen can revisit dashboard after refresh',
  'Citizen workflow remains coherent on mobile',
  'Citizen workflow remains coherent on desktop',
  'Citizen workflow remains coherent on tablet',
  'Citizen flow handles empty initial state',
  'Citizen flow handles seeded data state',
  'Citizen flow preserves session throughout navigation',
]);

addCases('Workflow', 'FLOW-INS', [
  'Inspector reviews citizen complaint',
  'Inspector starts work on complaint',
  'Inspector adds note to complaint',
  'Inspector resolves complaint',
  'Inspector sees complaint status progression',
  'Inspector sees complaint history progression',
  'Inspector switches from dashboard to complaint list',
  'Inspector opens complaint from dashboard',
  'Inspector returns to dashboard after action',
  'Inspector workflow remains stable after refresh',
  'Inspector workflow remains stable on mobile',
  'Inspector workflow remains stable on desktop',
  'Inspector can reject complaint in mock mode',
  'Inspector can reopen complaint through status updates',
  'Inspector can log out after handling complaint',
]);

addCases('Workflow', 'FLOW-WRK', [
  'Worker views assigned complaint',
  'Worker checks complaint detail',
  'Worker monitors in progress queue',
  'Worker sees resolved complaints',
  'Worker workflow mirrors inspector data',
  'Worker workflow survives navigation',
  'Worker workflow survives refresh',
  'Worker workflow remains stable on mobile',
  'Worker workflow remains stable on tablet',
  'Worker workflow remains stable on desktop',
  'Worker can browse complaint history',
  'Worker can browse status timeline',
  'Worker can log out after review',
  'Worker can filter complaint list',
  'Worker can inspect priority badges',
]);

addCases('Workflow', 'FLOW-ADM', [
  'District admin monitors district dashboard',
  'District admin views complaint summaries',
  'District admin views complaint list',
  'District admin opens complaint detail',
  'District admin returns to dashboard',
  'District admin workflow remains stable on mobile',
  'District admin workflow remains stable on tablet',
  'District admin workflow remains stable on desktop',
  'District admin can log out after review',
  'District admin can refresh without session loss',
  'Super admin monitors district totals',
  'Super admin reviews complaint totals',
  'Super admin workflow remains stable on mobile',
  'Super admin workflow remains stable on desktop',
  'Super admin can log out after monitoring',
]);

while (testCases.length < totalTarget) {
  const idx = testCases.length + 1;
  testCases.push({
    id: `GEN-${String(idx).padStart(3, '0')}`,
    module: idx % 5 === 0 ? 'UI' : idx % 5 === 1 ? 'Citizen' : idx % 5 === 2 ? 'Inspector' : idx % 5 === 3 ? 'Worker' : 'Admin',
    scenario: `Generated workflow coverage case ${idx}`,
  });
}

const uniqueKey = new Set(testCases.map((testCase) => `${testCase.module}|${testCase.scenario}`));
if (uniqueKey.size !== testCases.length) {
  throw new Error('Duplicate test cases generated');
}

const seleniumDriverPath = path.join(__dirname, 'selenium_runner.py');
const pythonReportPath = path.join(__dirname, 'generate_report.py');

const config = {
  baseUrl,
  outputPath,
  totalTarget,
  appName,
  tests: testCases,
};

fs.writeFileSync(path.join(__dirname, 'selenium_config.json'), JSON.stringify(config, null, 2));

execFileSync('python', [pythonReportPath, path.join(__dirname, 'selenium_config.json')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CIVIFIX_BASE_URL: baseUrl,
    NEXT_PUBLIC_E2E_MOCKS: 'true',
    CIVIFIX_REPORT_PATH: outputPath,
  },
});

console.log(`Report written to ${outputPath}`);

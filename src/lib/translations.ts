/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ur';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const translations: TranslationDictionary = {
  // Navigation
  navHome: { en: 'Home', ur: 'ہوم' },
  navAbout: { en: 'About Us', ur: 'ہمارے بارے میں' },
  navResearch: { en: 'Research', ur: 'تحقیق' },
  navJobs: { en: 'Jobs', ur: 'نوکریاں' },
  navApply: { en: 'Apply Online', ur: 'آن لائن اپلائی' },
  navContact: { en: 'Contact Us', ur: 'رابطہ کریں' },
  navLogin: { en: 'Login', ur: 'لاگ ان' },
  navLogout: { en: 'Logout', ur: 'لاگ آؤٹ' },
  navAdminPanel: { en: 'Admin Panel', ur: 'ایڈمن پینل' },
  navAdminLogin: { en: 'Admin Login', ur: 'ایڈمن لاگ ان' },
  navApplicantPortal: { en: 'Applicant Portal', ur: 'امیدوار پورٹل' },
  hello: { en: 'Hello', ur: 'سلام' },

  // General Buttons
  btnApplyNow: { en: 'Apply For This Position', ur: 'اس نوکری کے لیے اپلائی کریں' },
  btnSubmit: { en: 'Submit', ur: 'جمع کروائیں' },
  btnCancel: { en: 'Cancel', ur: 'منسوخ کریں' },
  btnBack: { en: 'Back', ur: 'پیچھے' },
  btnNext: { en: 'Next', ur: 'اگلا' },
  btnConfirm: { en: 'Confirm', ur: 'تصدیق کریں' },
  btnDownload: { en: 'Download', ur: 'ڈاؤن لوڈ کریں' },
  btnUploading: { en: 'Uploading...', ur: 'اپ لوڈ ہو رہا ہے...' },
  btnSubmitting: { en: 'Submitting...', ur: 'جمع ہو رہا ہے...' },
  btnSearch: { en: 'Search', ur: 'تلاش کریں' },
  btnReset: { en: 'Reset', ur: 'دوبارہ ترتیب دیں' },

  // Hero Section
  heroTitle: { en: 'Empowering Ocean Exploration', ur: 'سمندری مہم جوئی کو بااختیار بنانا' },
  heroSubtitle: { en: 'Autonomous Unmanned Surface Vehicles & Deep-Sea Robotic Solutions', ur: 'خود مختار بغیر پائلٹ کے سطحی جہاز اور گہرے سمندر کے روبوٹک حل' },
  heroCta: { en: 'How to Apply', ur: 'درخواست کا طریقہ' },

  // About Section
  aboutHeading: { en: 'About HYDROCEAN', ur: 'ہائیڈروشن کے بارے میں' },
  aboutText: { en: 'HYDROCEAN is a pioneering maritime engineering enterprise specializing in high-performance autonomous surface vessels (USVs), subsea brushless thrusters, and unmanned underwater vehicles (UUVs).', ur: 'ہائیڈروشن ایک اہم سمندری انجینئرنگ ادارہ ہے جو اعلیٰ کارکردگی والے خود مختار سطحی جہازوں (USVs)، سب میرین برش لیس تھرسٹرز، اور بغیر پائلٹ کے زیرِ آب گاڑیوں (UUVs) میں مہارت رکھتا ہے۔' },
  missionTitle: { en: 'Our Mission', ur: 'ہمارا مشن' },
  missionDesc: { en: 'To design and deploy advanced marine technology that enables safe, sustainable, and high-precision ocean exploration.', ur: 'جدید سمندری ٹیکنالوجی کو ڈیزائن اور تعینات کرنا جو محفوظ، پائیدار، اور اعلیٰ صحت سے متعلق سمندری تلاش کو قابل بناتی ہے۔' },
  visionTitle: { en: 'Our Vision', ur: 'ہمارا وژن' },
  visionDesc: { en: 'To lead the global transition toward fully autonomous oceanographic research and commercial maritime operations.', ur: 'مکمل طور پر خود مختار سمندری تحقیق اور تجارتی سمندری کارروائیوں کی طرف عالمی منتقلی کی قیادت کرنا۔' },
  valuesTitle: { en: 'Core Values', ur: 'بنیادی اقدار' },
  valuesDesc: { en: 'Precision engineering, ecological sustainability, and transparent technological breakthrough.', ur: 'صحت سے متعلق انجینئرنگ، ماحولیاتی پائیداری، اور شفاف تکنیکی پیش رفت۔' },

  // Jobs Section
  jobsHeading: { en: 'Active Positions', ur: 'دستیاب نوکریاں' },
  jobsSubtitle: { en: 'Join our elite research and operations teams across global marine stations.', ur: 'عالمی سمندری اسٹیشنوں پر ہماری اشرافیہ کی تحقیقی اور آپریشنز ٹیموں میں شامل ہوں۔' },
  jobQualification: { en: 'Qualification', ur: 'تعلیمی قابلیت' },
  jobSalary: { en: 'Salary Bracket', ur: 'تنخواہ' },
  jobLocation: { en: 'Location Coordinates', ur: 'مقام' },
  jobOpenStatus: { en: 'Open', ur: 'دستیاب' },
  jobClosedStatus: { en: 'Closed', ur: 'بند' },
  jobSearchPlaceholder: { en: 'Search positions by title, keyword, or skills...', ur: 'عہدے، مطلوبہ الفاظ، یا مہارتوں کے حساب سے تلاش کریں...' },
  jobFilterLocation: { en: 'All Locations', ur: 'تمام مقامات' },

  // How to Apply Steps
  howHeading: { en: 'Application Flow', ur: 'اپلائی کرنے کا طریقہ کار' },
  howStep1Title: { en: '1. Choose & Register', ur: '1. نوکری کا انتخاب اور رجسٹریشن' },
  howStep1Desc: { en: 'Select your target vacancy profile and create a secure verified recruitment account.', ur: 'اپنے مطلوبہ ملازمت کے پروفائل کا انتخاب کریں اور ایک محفوظ تصدیق شدہ بھرتی اکاؤنٹ بنائیں۔' },
  howStep2Title: { en: '2. Deposit Processing fee', ur: '2. پروسیسنگ فیس جمع کروائیں' },
  howStep2Desc: { en: 'Transfer the required application processing fee of PKR 2,500 using Meezan net-banking.', ur: 'میزان نیٹ بینکنگ کا استعمال کرتے ہوئے PKR 2,500 کی مطلوبہ درخواست پروسیسنگ فیس منتقل کریں۔' },
  howStep3Title: { en: '3. Verify & Download Slip', ur: '3. تصدیق کریں اور رسید ڈاؤن لوڈ کریں' },
  howStep3Desc: { en: 'Simulate instant verification through our bank gateway and download the official payment slip.', ur: 'ہمارے بینک گیٹ وے کے ذریعے فوری تصدیق کی نقل کریں اور سرکاری ادائیگی کی رسید ڈاؤن لوڈ کریں۔' },
  howStep4Title: { en: '4. Upload Records & Submit', ur: '4. دستاویزات اپ لوڈ کریں اور جمع کروائیں' },
  howStep4Desc: { en: 'Attach your CV, candidate photo, CNIC copy, and deposit slip to complete your file.', ur: 'اپنی فائل مکمل کرنے کے لیے اپنا سی وی، امیدوار کی تصویر، شناختی کارڈ کی کاپی، اور ڈیپازٹ سلپ منسلک کریں۔' },

  // Application Form Fields
  formHeading: { en: 'Recruitment Application File', ur: 'بھرتی کی درخواست کی فائل' },
  fieldFullName: { en: 'Full Name *', ur: 'پورا نام *' },
  fieldFatherName: { en: 'Father\'s Name *', ur: 'والد کا نام *' },
  fieldEmail: { en: 'Email Coordinates *', ur: 'ای میل ایڈریس *' },
  fieldWhatsApp: { en: 'WhatsApp Coordinate *', ur: 'واٹس ایپ نمبر *' },
  fieldCNIC: { en: 'CNIC / Identity Card *', ur: 'شناختی کارڈ نمبر *' },
  fieldDOB: { en: 'Date of Birth *', ur: 'تاریخ پیدائش *' },
  fieldGender: { en: 'Gender *', ur: 'جنس *' },
  fieldGenderMale: { en: 'Male', ur: 'مرد' },
  fieldGenderFemale: { en: 'Female', ur: 'خواتین' },
  fieldQualification: { en: 'Highest Academic Qualification *', ur: 'اعلیٰ ترین تعلیمی قابلیت *' },
  fieldSkills: { en: 'Technical Skills Outline *', ur: 'تکنیکی مہارتیں *' },
  fieldSkillsDesc: { en: 'Specify key technical proficiencies (e.g. ROS, C++, DSP, Sonar). Min 10 chars.', ur: 'اہم تکنیکی مہارتیں بتائیں۔ کم از کم 10 حروف۔' },
  fieldExperience: { en: 'Hiring Experience Portfolio *', ur: 'تجربہ کار اور تفصیلی پروفائل *' },
  fieldExperienceDesc: { en: 'Briefly summarize your maritime, engineering, or robotics operations history.', ur: 'اپنی سمندری، انجینئرنگ، یا روبوٹکس آپریشنز کی تاریخ کا مختصر خلاصہ لکھیں۔' },
  fieldCity: { en: 'Mailing City Coordinates *', ur: 'شہر کا نام *' },
  fieldProvince: { en: 'Province / Territory *', ur: 'صوبہ *' },
  fieldPassportAvailable: { en: 'Do you possess a valid Passport? *', ur: 'کیا آپ کے پاس درست پاسپورٹ ہے؟ *' },
  fieldPassportAvailableYes: { en: 'Yes', ur: 'جی ہاں' },
  fieldPassportAvailableNo: { en: 'No', ur: 'جی نہیں' },
  fieldUploadPassport: { en: 'Upload Passport Details (Optional)', ur: 'پاسپورٹ اپ لوڈ کریں (اختیاری)' },
  fieldUploadCv: { en: 'Upload Professional CV / Resume *', ur: 'پیشہ ورانہ سی وی / ریزیومے اپ لوڈ کریں *' },
  fieldUploadPhoto: { en: 'Upload Candidate Passport Photo *', ur: 'امیدوار کا پاسپورٹ سائز فوٹو اپ لوڈ کریں *' },
  fieldMathCaptcha: { en: 'Math CAPTCHA Challenge *', ur: 'ریاضی کا کیپچا چیلنج *' },
  fieldDeclaration: { en: 'I solemnly declare that all provided recruitment credentials are true and correct.', ur: 'میں حلفاً اقرار کرتا ہوں کہ فراہم کردہ تمام بھرتی کی اسناد درست اور صحیح ہیں۔' },
  fieldTerms: { en: 'I accept HYDROCEAN application terms and security evaluation workflows.', ur: 'میں ہائیڈروشن کی درخواست کی شرائط اور حفاظتی جائزہ کے طریقہ کار کو قبول کرتا ہوں۔' },

  // Payment Gateway
  paymentModalTitle: { en: 'Meezan Bank Payment Gateway', ur: 'میزان بینک پیمنٹ گیٹ وے' },
  paymentProgressStep1: { en: 'Authorize Fee', ur: 'فیس کی منظوری' },
  paymentProgressStep2: { en: 'Processing', ur: 'پروسیسنگ' },
  paymentProgressStep3: { en: 'Complete', ur: 'مکمل' },
  paymentInstructionsHeading: { en: 'Transfer Coordinates', ur: 'منتقلی کی تفصیلات' },
  paymentInstructionsBody: { en: 'Please transfer the required processing fee. Secure simulated banking transfer below.', ur: 'براہ کرم پروسیسنگ فیس منتقل کریں۔ ذیل میں محفوظ فرضی بینک ٹرانزیکشن کی اجازت دیں۔' },
  paymentAmount: { en: 'Amount Payable', ur: 'قابلِ ادائیگی رقم' },
  paymentAccountNo: { en: 'Meezan Simulated Account Number *', ur: 'میزان فرضی اکاؤنٹ نمبر *' },
  paymentPIN: { en: '4-Digit Transaction PIN *', ur: '4 ہندسوں کا ٹرانزیکشن پن *' },
  paymentAuthorizeBtn: { en: 'Submit Payment & Authorize', ur: 'ادائیگی جمع کروائیں اور تصدیق کریں' },
  paymentVerifySuccess: { en: 'Payment Success!', ur: 'ادائیگی کامیابی سے مکمل ہو گئی!' },
  paymentVerifySuccessDesc: { en: 'Your payment was approved and verified securely.', ur: 'آپ کی ادائیگی کو کامیابی اور حفاظت سے منظور کر لیا گیا ہے۔' },

  // About and Contact Page Custom sections
  contactHeading: { en: 'Emergency Coordinates & Helpdesk', ur: 'ایمرجنسی کوآرڈینیٹس اور ہیلپ ڈیسک' },
  contactSubtitle: { en: 'Get in touch with our recruitment support office directly.', ur: 'ہماری بھرتی سپورٹ ٹیم سے براہ راست رابطہ کریں۔' },
  contactOfficeAddress: { en: 'Office Coordinates', ur: 'دفتر کا پتہ' },
  contactWorkingHours: { en: 'Operational Hours', ur: 'کام کے اوقات' },
  contactFormHeading: { en: 'Send Administrative Message', ur: 'انتظامی پیغام بھیجیں' },
  contactFieldName: { en: 'Your Name', ur: 'آپ کا نام' },
  contactFieldMessage: { en: 'Your Message', ur: 'پیغام کا متن' },
  contactFormSuccess: { en: 'Message sent successfully. Our support desk will reply shortly.', ur: 'پیغام کامیابی سے بھیج دیا گیا۔ ہمارا سپورٹ ڈیسک جلد جواب دے گا۔' },

  // Testimonials
  testimonialsHeading: { en: 'Testimonials', ur: 'تاثرات' },
  testimonialsSubtitle: { en: 'Hear from our elite engineers working globally.', ur: 'عالمی سطح پر کام کرنے والے ہمارے اشرافیہ انجینئرز کے تاثرات سنیں۔' },

  // Notification center
  notifCenterTitle: { en: 'Security Alerts & Notifications', ur: 'سیکورٹی الرٹس اور اطلاعات' },
  notifCenterMarkAllRead: { en: 'Mark all as read', ur: 'سبھی کو پڑھا ہوا نشان زد کریں' },
  notifCenterEmpty: { en: 'No new security notifications.', ur: 'کوئی نئی اطلاعات دستیاب نہیں ہیں۔' },

  // Applicant Authentication
  authLoginTitle: { en: 'Applicant Login', ur: 'امیدوار لاگ ان' },
  authSignupTitle: { en: 'Create Account', ur: 'نیا اکاؤنٹ بنائیں' },
  authVerifyOtpTitle: { en: 'Verify Email OTP', ur: 'ای میل او ٹی پی کی تصدیق کریں' },
  authForgotTitle: { en: 'Reset Security', ur: 'سیکیورٹی دوبارہ ترتیب دیں' },
  authResetTitle: { en: 'Choose Password', ur: 'پاس ورڈ کا انتخاب کریں' },
  authLoginSub: { en: 'Sign in to access your program recruitment file', ur: 'اپنے پروگرام بھرتی کی فائل تک رسائی کے لیے سائن ان کریں' },
  authSignupSub: { en: 'Register your details to begin program admission', ur: 'پروگرام میں داخلہ شروع کرنے کے لیے اپنی تفصیلات درج کریں' },
  authVerifyOtpSub: { en: 'Enter 6-digit verification pin sent to your email', ur: 'اپنے ای میل پر بھیجا گیا 6 ہندسوں کا تصدیقی پن درج کریں' },
  authForgotSub: { en: 'We will generate a reset credential for your email', ur: 'ہم آپ کے ای میل کے لیے ری سیٹ کرنے کی اسناد تیار کریں گے' },
  authResetSub: { en: 'Enter your password reset token & new password', ur: 'اپنا پاس ورڈ ری سیٹ ٹوکن اور نیا پاس ورڈ درج کریں' },
  authEmail: { en: 'Email Address', ur: 'ای میل ایڈریس' },
  authPassword: { en: 'Password Security Key', ur: 'پاس ورڈ سیکیورٹی کلید' },
  authRemember: { en: 'Remember Me', ur: 'مجھے یاد رکھیں' },
  authForgotBtn: { en: 'Forgot Password?', ur: 'پاس ورڈ بھول گئے؟' },
  authLoginButton: { en: 'Verify and Access Portal', ur: 'تصدیق کریں اور پورٹل تک رسائی حاصل کریں' },
  authNoAccountText: { en: "Don't have a secure recruitment file?", ur: 'کیا آپ کے پاس بھرتی کی فائل نہیں ہے؟' },
  authRegisterBtn: { en: 'Register here', ur: 'یہاں رجسٹر کریں' },
  authGoogleButton: { en: 'Continue with Google Identity Service', ur: 'گوگل کے ساتھ جاری رکھیں' },
  authFirstName: { en: 'First Name', ur: 'پہلا نام' },
  authLastName: { en: 'Last Name', ur: 'آخری نام' },
  authConfirmPassword: { en: 'Confirm Password Security Key', ur: 'پاس ورڈ سیکیورٹی کلید کی تصدیق کریں' },
  authRegisterButton: { en: 'Register Recruitment File', ur: 'بھرتی کی فائل رجسٹر کریں' },
  authHasAccountText: { en: 'Already possess verified credentials?', ur: 'پہلے سے ہی تصدیق شدہ اسناد موجود ہیں؟' },
  authLoginLink: { en: 'Login here', ur: 'یہاں لاگ ان کریں' },
  authNewEmailPlaceholder: { en: 'new-email@example.com', ur: 'نیا ای میل درج کریں' },
  authChangeEmailBtn: { en: 'Update Email', ur: 'ای میل تبدیل کریں' },
  authWrongEmailLink: { en: 'Incorrect email? Change address', ur: 'غلط ای میل؟ پتہ تبدیل کریں' },
  authOtpLabel: { en: '6-Digit Secure OTP Pin', ur: '6 ہندسوں کا سیکیور او ٹی پی پن' },
  authOtpVerifyButton: { en: 'Verify OTP & Register', ur: 'او ٹی پی کی تصدیق اور رجسٹریشن کریں' },
  authResendCodeText: { en: 'Resend verification token in', ur: 'تصدیقی کوڈ دوبارہ بھیجیں سیکنڈز میں:' },
  authResendCodeBtn: { en: 'Resend Code', ur: 'کوڈ دوبارہ بھیجیں' },
  authForgotSubtitle: { en: 'Enter your registered email address to receive access credentials.', ur: 'رسائی کی اسناد حاصل کرنے کے لیے اپنا رجسٹرڈ ای میل ایڈریس درج کریں۔' },
  authSendRecoveryBtn: { en: 'Send Recovery Instructions', ur: 'بحالی کی ہدایات بھیجیں' },
  authResetTokenLabel: { en: 'Password Reset Token', ur: 'پاس ورڈ دوبارہ ترتیب دینے کا ٹوکن' },
  authNewPasswordLabel: { en: 'New Password Security Key', ur: 'نیا پاس ورڈ' },
  authUpdateCredentialsBtn: { en: 'Update Credentials', ur: 'اسناد اپ ڈیٹ کریں' },
  authBackToLogin: { en: 'Back to Login', ur: 'لاگ ان پر واپس جائیں' },

  // About Page Elements
  aboutFacilitiesHeading: { en: 'Our Professional Facilities', ur: 'ہماری پیشہ ورانہ سہولیات' },
  aboutFacilitiesText: { en: 'Our state-of-the-art testing workspace houses high-end calibration suites: 100Nm to 3000Nm motor performance test heads, three-coordinate coordinate measurements, 200kg mooring thrust test platforms, and deep-sea pressure vessels up to 8000 meters.', ur: 'ہمارے جدید ترین ٹیسٹنگ ورک اسپیس میں ہائی اینڈ کیلیبریشن سوئٹ موجود ہیں: 100Nm سے 3000Nm موٹر پرفارمنس ٹیسٹ ہیڈز، تھری کوآرڈینیٹ پیمائش، 200kg مورنگ تھرسٹ ٹیسٹ پلیٹ فارم، اور 8000 میٹر تک کے گہرے سمندری پریشر والے برتن۔' },
  aboutCertified: { en: 'CE & RoHS Certified', ur: 'CE اور RoHS سے تصدیق شدہ' },
  aboutQuality: { en: 'ISO 9001 Quality', ur: 'ISO 9001 معیار' },
  aboutPhds: { en: '60+ PhDs & Researchers', ur: '60+ پی ایچ ڈیز اور محققین' },
  aboutTrustHeading: { en: 'Why Leading Research Labs Trust Hydrocean', ur: 'معروف ریسرچ لیبز ہائیڈروشن پر کیوں بھروسہ کرتی ہیں' },
  aboutAdv1Title: { en: 'Rich Product Matrix', ur: 'امیر پروڈکٹ میٹرکس' },
  aboutAdv1Desc: { en: 'With over 100 standard and non-standard products, we deliver industrial-grade thrusters, subsea electric actuators, and steering setups.', ur: '100 سے زیادہ معیاری اور غیر معیاری مصنوعات کے ساتھ، ہم صنعتی درجے کے تھرسٹرز، سب میرین الیکٹرک ایکچیویٹرز، اور اسٹیئرنگ سیٹ اپ فراہم کرتے ہیں۔' },
  aboutAdv2Title: { en: 'Advanced Tech Architecture', ur: 'جدید ٹیک فن تعمیر' },
  aboutAdv2Desc: { en: 'Proprietary high-magnetic-density permanent magnet motors, FOC vector algorithm, fluid mechanics, and low-noise underwater controls.', ur: 'ملکیتی ہائی مقناطیسی کثافت مستقل مقناطیسی موٹرز، FOC ویکٹر الگورتھم، فلوڈ میکینکس، اور کم شور زیرِ آب کنٹرولز۔' },
  aboutAdv3Title: { en: 'Good Product Consistency', ur: 'اچھا پروڈکٹ مستقل مزاجی' },
  aboutAdv3Desc: { en: 'Every item is subject to strict automated mass production processes, guaranteeing precise tolerance limits and long-term durability.', ur: 'ہر آئٹم سخت خودکار بڑے پیمانے پر پیداواری عمل سے گزرتا ہے، جو عین مطابق رواداری کی حد اور طویل مدتی پائیداری کی ضمانت دیتا ہے۔' },
  aboutAdv4Title: { en: 'Extreme Reliability', ur: 'انتہائی قابل اعتماد' },
  aboutAdv4Desc: { en: 'Vibration, temperature shock, water pressure limits (up to 8000m), aging test, and electromagnetic compatibility tests.', ur: 'وائبریشن، درجہ حرارت کا جھٹکا، پانی کے دباؤ کی حد (8000m تک)، عمر بڑھنے کا ٹیسٹ، اور برقی مقناطیسی مطابقت کے ٹیسٹ۔' },

  // USV Section
  usvLabel: { en: 'Unmanned Surface Vehicles (USV)', ur: 'بغیر پائلٹ کے سطحی جہاز (USV)' },
  usvHeading: { en: 'Autonomous Patrol & Survey Vessels', ur: 'خود مختار گشتی اور سروے جہاز' },
  usvDesc: { en: 'Hydrocean USVs navigate extreme open-water environments with advanced waypoint guidance, dynamic pathing, obstacle-avoidance lidar, and robust satellite integrations.', ur: 'ہائیڈروشن USVs ایڈوانسڈ وے پوائنٹ گائیڈنس، ڈائنامک پاتھنگ، رکاوٹوں سے بچنے والے لائیڈار، اور مضبوط سیٹلائٹ انٹیگریشنز کے ساتھ انتہائی کھلے پانی کے ماحول میں سفر کرتے ہیں۔' },
  usvAutoLevel: { en: 'Autonomous Level 4 Standard', ur: 'خود مختاری لیول 4 معیار' },
  usvTechSpecBtn: { en: 'Technical Spec', ur: 'تکنیکی تفصیلات' },
  usvModalParamsTitle: { en: 'Technical Parameters', ur: 'تکنیکی پیرامیٹرز' },
  usvCloseBtn: { en: 'Close Parameters', ur: 'پیرامیٹرز بند کریں' },
  usvPropulsion: { en: 'Solar/Jet Propulsion', ur: 'شمسی/جیٹ پروپلشن' },

  // UUV Section
  uuvLabel: { en: 'Unmanned Underwater Vehicles (UUV)', ur: 'بغیر پائلٹ کے زیرِ آب گاڑیاں (UUV)' },
  uuvHeading: { en: 'Deep-Sea Propelling & Actuating Solutions', ur: 'گہرے سمندر میں چلنے والے اور تحریک دینے والے حل' },
  uuvDesc: { en: 'Hydrocean supplies specialized, pressure-tolerant subsea motor drives and actuators to leading deep-ocean research programs and submersibles globally. Explore our modular underwater components that drive deep-sea robotic arm articulators.', ur: 'ہائیڈروشن دنیا بھر میں معروف گہرے سمندر کے تحقیقی پروگراموں اور آبدوزوں کو خصوصی، دباؤ کو برداشت کرنے والی سب میرین موٹر ڈرائیوز اور ایکچیویٹرز فراہم کرتا ہے۔ ہمارے ماڈیولر انڈر واٹر اجزاء کو دریافت کریں جو گہرے سمندر میں روبوٹک بازو کے جوڑوں کو چلاتے ہیں۔' },
  uuvCasingHeading: { en: 'Autonomous UUV', ur: 'خود مختار UUV' },
  uuvCasingSub: { en: 'Deep ocean mapping ready', ur: 'گہرے سمندر کا نقشہ تیار ہے' },
  uuvPressureHeading: { en: 'Pressure Tolerance', ur: 'دباؤ برداشت کرنے کی صلاحیت' },
  uuvPressureSub: { en: 'Validated inside 80MPa chambers', ur: '80MPa چیمبرز کے اندر تصدیق شدہ' },

  // How to Apply subtitle
  howSubtitle: { en: 'Complete your formal recruitment and admission files in four easy steps.', ur: 'چار آسان اقدامات میں اپنی رسمی بھرتی اور داخلے کی فائلیں مکمل کریں۔' },

  // Contact Section Custom
  contactHeadingCustom: { en: 'Contact Our Administrative Desks', ur: 'ہمارے انتظامی ڈیسک سے رابطہ کریں' },
  contactFormHeadingCustom: { en: 'Dispatch Secure Query', ur: 'محفوظ انکوائری بھیجیں' },
  contactFieldNameCustom: { en: 'Your Name *', ur: 'آپ کا نام *' },
  contactFieldEmailCustom: { en: 'Email Address *', ur: 'ای میل ایڈریس *' },
  contactFieldSubjectCustom: { en: 'Subject Matter *', ur: 'مضمون *' },
  contactFieldMessageCustom: { en: 'Message Description *', ur: 'پیغام کی تفصیل *' },
  contactFormSuccessCustom: { en: 'Your message has been successfully routed to our support queue.', ur: 'آپ کا پیغام کامیابی کے ساتھ ہمارے سپورٹ کیو میں بھیج دیا گیا ہے۔' },
  contactOfficeTitle: { en: 'Office Headquarters', ur: 'دفتر کا ہیڈ کوارٹر' },
  contactAddressLabel: { en: 'Physical Location', ur: 'مادی مقام' },
  contactEmailLabel: { en: 'Email Directory', ur: 'ای میل ڈائرکٹری' },
  contactPhoneLabel: { en: 'Admin Phone Line', ur: 'ایڈمن فون لائن' },
  contactHoursLabel: { en: 'Operational Hours', ur: 'کام کے اوقات' },
  contactWhatsAppBtn: { en: 'Quick WhatsApp Help Desk', ur: 'فوری واٹس ایپ ہیلپ ڈیسک' },
  contactSendBtn: { en: 'Send Message', ur: 'پیغام بھیجیں' },

  // Research Timeline
  timelineLabel: { en: 'Research & Development Milestones', ur: 'تحقیق اور ترقی کے سنگ میل' },
  timelineHeading: { en: 'Our Technological Journey', ur: 'ہمارا تکنیکی سفر' },
  timelineDesc: { en: 'From a small subsea motor lab to a premier global supplier of oceanographic exploration robotics.', ur: 'ایک چھوٹی سب میرین موٹر لیب سے سمندری مہم جوئی کی روبوٹکس کے ایک اہم عالمی فراہم کنندہ تک کا سفر۔' },

  // Step wizard labels
  stepLabel1: { en: 'Applicant Info', ur: 'امیدوار کی معلومات' },
  stepLabel2: { en: 'Fee Payment', ur: 'فیس کی ادائیگی' },
  stepLabel3: { en: 'Deposit Slip', ur: 'ڈپازٹ سلپ' },
  stepLabel4: { en: 'CV/Resume', ur: 'سی وی / ریزیومے' },
  stepLabel5: { en: 'Picture Upload', ur: 'تصویر اپلوڈ' },
  stepLabel6: { en: 'Submit', ur: 'جمع کروائیں' },
};

export const getTranslation = (key: string, lang: Language): string => {
  const tr = translations[key];
  if (!tr) return key;
  return tr[lang] || tr['en'] || key;
};

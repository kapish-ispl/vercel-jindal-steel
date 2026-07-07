import * as Yup from "yup";

// ─── HTML/Script Injection Guard ──────────────────────────────────────────────
export const hasHtmlOrScript = (value: string): boolean => {
  const htmlTagPattern = /<[a-z/][\s\S]*>/i;
  const eventHandlerPattern = /\bon\w+\s*=/i;
  const scriptSchemePattern = /\b(javascript|vbscript):/i;
  const cdataPattern = /<!\[CDATA\[/i;
  const cssExpressionPattern = /\bexpression\s*\(/i;
  
  return (
    htmlTagPattern.test(value) ||
    eventHandlerPattern.test(value) ||
    scriptSchemePattern.test(value) ||
    cdataPattern.test(value) ||
    cssExpressionPattern.test(value)
  );
};

/**
 * Custom safe string validator that prevents any HTML tags or script injection.
 */
export const safeString = (message?: string) => {
  return Yup.string().test(
    "no-html-script",
    message || "HTML tags, script injections, or event handlers are not allowed",
    (value) => {
      if (!value) return true;
      return !hasHtmlOrScript(value);
    }
  );
};

// ─── Shared Regular Expressions ──────────────────────────────────────────────
export const REGEX = {
  phone: /^[6-9]\d{9}$/,
  year: /^(194[5-9]|19[5-9]\d|20\d{2})$/,
  percentage: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
  pincode: /^[1-9][0-9]{5}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  stdCode: /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
};

// ─── Centralised Validation Error Messages ──────────────────────────────────
export const VALIDATION_ERRORS = {
  required: {
    fullName: "Enter your Full Name",
    name: "Enter your Name",
    email: "Enter your Email Id",
    mobile: "Enter valid Mobile Number",
    company: "Enter Company Name",
    description: "Enter your Description",
    country: "Enter Country Name",
    city: "Enter City Name",
    captcha: "Captcha is required",
    gst: "GST Number is required",
    firmName: "Name of the Firm is required",
    firmAddress: "Address of the Firm is required",
    pincode: "Pincode is required",
    contactPerson: "Contact person name is required",
    dob: "Enter your Date of Birth",
    gender: "Select your Gender",
    experience: "Select your Experience",
    address: "Enter your Address",
    resume: "Please upload your resume",
    joiningDate: "Enter your Joining Date",
    relievingDate: "Relieving Date is required",
    jobProfile: "Enter your Job Profile",
    currentEmployment: "Select your current Employment",
    department: "Select Department",
    otherDepartment: "Enter Other Department",
    jobPosition: "Enter Job Position",
    jobCode: "Enter Job Code",
    jobLocation: "Enter Job Location",
    nationality: "Select your Nationality",
    stateName: "Enter your State Name",
    otherStateName: "Enter your Other State Name",
    stdCode: "Enter your Country Code",
  },
  invalid: {
    email: "Invalid email format",
    mobile: "Enter valid Mobile Number",
    gst: "Invalid GST Number format",
    pincode: "Pincode must be exactly 6 digits",
    pincodeDigits: "Pincode must contain only digits",
    contactPersonNumbers: "Contact Person Name cannot contain numbers",
    passingYear: "Enter a valid Passing Year",
    percentage: "Enter a valid Percentage (e.g., 85.5)",
    dobAge: "You must be at least 18 years old",
    relievingAfterJoining: "Relieving Date must be after Joining Date",
    stdCode: "Enter valid Country Code",
    gstLength: "GST Number must be exactly 15 characters",
    quantityNumber: "Quantity must be a number",
    quantityNegative: "Quantity cannot be negative",
  }
};

// ─── Interfaces ─────────────────────────────────────────────────────────────
export interface IProductFormValues {
  fullname: string;
  email: string;
  country: string;
  company: string;
  mobile: string;
  city: string;
  description: string;
  product: string;
  user_captcha_input: string;
}

export interface IEducationDetail {
  degree_name: string;
  course_name?: string;
  institute_name?: string;
  university_name?: string;
  passing_year: string;
  percentage: string;
}

export interface IExperienceDetail {
  organization_name: string;
  designation: string;
  joining_date: Date | null;
  relieving_date: Date | null;
  job_profile: string;
  is_current_employment: string;
}

export interface IJobApplicationValues {
  post_id?: string | number;
  current_openings: string;
  job_code: string;
  location: string;
  name: string;
  dob: Date | null;
  email: string;
  alternate_email?: string;
  gender: string;
  total_experience: string;
  other_experience?: string;
  notice_period?: string;
  nationality: string;
  country_name: string;
  state_name: string;
  other_state_name?: string;
  pincode: string;
  std_code: string;
  mobile_number: string;
  alternate_mobile_number?: string;
  address: string;
  city_name: string;
  key_skills?: string | string[];
  resume_id: string;
  user_captcha_input: string;
  education_details: IEducationDetail[];
  experience_details: IExperienceDetail[];
  isTalentForm?: boolean;
  skills?: string;
  department?: string;
  other_department?: string;
}

// ─── Validation Schemas ─────────────────────────────────────────────────────

/**
 * ProductForm Schema (Contact / Query / Product Enquiry Form)
 */
export const ProductFormSchema: Yup.ObjectSchema<any> = Yup.object({
  fullname: safeString().required(VALIDATION_ERRORS.required.fullName),
  email: safeString().email(VALIDATION_ERRORS.invalid.email).required(VALIDATION_ERRORS.required.email),
  mobile: safeString()
    .matches(REGEX.phone, VALIDATION_ERRORS.invalid.mobile)
    .required(VALIDATION_ERRORS.required.mobile),
  company: safeString().required(VALIDATION_ERRORS.required.company),
  description: safeString().required(VALIDATION_ERRORS.required.description),
  country: safeString().required(VALIDATION_ERRORS.required.country),
  city: safeString().required(VALIDATION_ERRORS.required.city),
  user_captcha_input: safeString().required(VALIDATION_ERRORS.required.captcha),
});

/**
 * JobApplication Schema (Career / Talent Form)
 */
export const JobApplicationSchema: Yup.ObjectSchema<any> = Yup.object({
  current_openings: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobPosition).trim(),
  }),
  skills: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().required(VALIDATION_ERRORS.required.jobPosition).trim(),
    otherwise: () => safeString().notRequired(),
  }),
  department: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().required(VALIDATION_ERRORS.required.department),
    otherwise: () => safeString().notRequired(),
  }),
  other_department: safeString().when("department", {
    is: (department: any) => department == "Others",
    then: () => safeString().required(VALIDATION_ERRORS.required.otherDepartment).trim(),
  }),
  job_code: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobCode).trim(),
  }),
  location: safeString().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => safeString().notRequired(),
    otherwise: () => safeString().required(VALIDATION_ERRORS.required.jobLocation).trim(),
  }),
  name: safeString().required(VALIDATION_ERRORS.required.name).trim(),
  dob: Yup.date()
    .nullable()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), VALIDATION_ERRORS.invalid.dobAge)
    .required(VALIDATION_ERRORS.required.dob),
  email: safeString().email(VALIDATION_ERRORS.invalid.email).required(VALIDATION_ERRORS.required.email).trim(),
  alternate_email: safeString().email(VALIDATION_ERRORS.invalid.email).trim(),
  gender: safeString().required(VALIDATION_ERRORS.required.gender).trim(),
  total_experience: safeString().required(VALIDATION_ERRORS.required.experience).trim(),
  other_experience: safeString().when("total_experience", {
    is: (total_experience: any) => total_experience == "15",
    then: () => safeString().required(VALIDATION_ERRORS.required.experience).trim(),
    otherwise: () => safeString().notRequired(),
  }),
  notice_period: safeString().trim(),
  nationality: safeString().required(VALIDATION_ERRORS.required.nationality).trim(),
  country_name: safeString().required(VALIDATION_ERRORS.required.country).trim(),
  state_name: safeString().required(VALIDATION_ERRORS.required.stateName).trim(),
  pincode: safeString()
    .matches(REGEX.pincode, VALIDATION_ERRORS.invalid.pincode)
    .required(VALIDATION_ERRORS.required.pincode)
    .trim(),
  std_code: safeString()
    .required(VALIDATION_ERRORS.required.stdCode)
    .trim(),
  mobile_number: safeString()
    .matches(REGEX.phone, VALIDATION_ERRORS.invalid.mobile)
    .required(VALIDATION_ERRORS.required.mobile)
    .trim(),
  alternate_mobile_number: safeString()
    .matches(REGEX.phone, VALIDATION_ERRORS.invalid.mobile)
    .trim(),
  address: safeString().required(VALIDATION_ERRORS.required.address).trim(),
  city_name: safeString().required(VALIDATION_ERRORS.required.city).trim(),
  key_skills: Yup.lazy((value) => {
    if (Array.isArray(value)) {
      return Yup.array().of(safeString()).min(1, "Select at least one skill").required("Select key skills");
    }
    return safeString().required("Select key skills").trim();
  }) as any,
  resume_id: safeString().required(VALIDATION_ERRORS.required.resume).trim(),
  user_captcha_input: safeString().required(VALIDATION_ERRORS.required.captcha).trim(),
  education_details: Yup.array()
    .of(
      Yup.object({
        degree_name: safeString().required(VALIDATION_ERRORS.required.name).trim(),
        course_name: safeString().trim(),
        institute_name: safeString().trim(),
        university_name: safeString().trim(),
        passing_year: safeString()
          .matches(REGEX.year, VALIDATION_ERRORS.invalid.passingYear)
          .required(VALIDATION_ERRORS.required.passingYear)
          .trim(),
        percentage: safeString()
          .matches(REGEX.percentage, VALIDATION_ERRORS.invalid.percentage)
          .required(VALIDATION_ERRORS.required.percentage)
          .trim(),
      })
    )
    .required("Education details are required")
    .min(1, "At least one education detail is required"),
  experience_details: Yup.lazy((value, { parent }) => {
    if (parent?.total_experience === "0") {
      return Yup.array().notRequired();
    }
    return Yup.array().of(
      Yup.object({
        organization_name: safeString().required(VALIDATION_ERRORS.required.firmName).trim(),
        designation: safeString().required(VALIDATION_ERRORS.required.jobProfile).trim(),
        joining_date: Yup.date()
          .nullable()
          .max(new Date(), "Joining date cannot be in the future")
          .required(VALIDATION_ERRORS.required.joiningDate),
        relieving_date: Yup.date()
          .nullable()
          .required(VALIDATION_ERRORS.required.relievingDate)
          .test(
            "is-greater",
            VALIDATION_ERRORS.invalid.relievingAfterJoining,
            function (val) {
              const { joining_date } = this.parent as any;
              if (!val || !joining_date) return true;
              return val > joining_date;
            }
          ),
        job_profile: safeString().required(VALIDATION_ERRORS.required.jobProfile).trim(),
        is_current_employment: safeString().required(VALIDATION_ERRORS.required.currentEmployment).trim(),
      })
    ).required("Experience details are required");
  }),
}) as any;

/**
 * Generates dynamic MSME Form Schema based on a product list.
 */
export const getMsmeFormSchema = (productList: Array<{ key: string; label: string }>) => {
  const productsShape: Record<string, any> = {};

  productList.forEach(({ key, label }) => {
    productsShape[key] = Yup.boolean();

    productsShape[`${key}_quantity`] = Yup.number()
      .typeError(VALIDATION_ERRORS.invalid.quantityNumber)
      .min(0, VALIDATION_ERRORS.invalid.quantityNegative)
      .nullable()
      .when(key, {
        is: true,
        then: (schema) => schema.required(`Quantity is required when ${label} is selected`),
        otherwise: (schema) => schema.notRequired().nullable(),
      })
      .test(
        `require-checkbox-if-${key}-quantity-present`,
        `Please check the product (${label})`,
        function (value) {
          const checkbox = this.parent[key];
          return !value || checkbox === true;
        }
      );
  });

  return Yup.object({
    gst_number: safeString()
      .trim()
      .required(VALIDATION_ERRORS.required.gst)
      .length(15, VALIDATION_ERRORS.invalid.gstLength)
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        VALIDATION_ERRORS.invalid.gst
      ),
    email: safeString().email(VALIDATION_ERRORS.invalid.email).required(VALIDATION_ERRORS.required.email),
    mobile: safeString()
      .matches(/^\d{10}$/, VALIDATION_ERRORS.invalid.mobile)
      .required(VALIDATION_ERRORS.required.mobile),
    name_of_the_firm: safeString().trim().required(VALIDATION_ERRORS.required.firmName),
    address_of_the_firm: safeString().trim().required(VALIDATION_ERRORS.required.firmAddress),
    pincode: safeString().trim()
      .length(6, VALIDATION_ERRORS.invalid.pincode)
      .matches(/^\d{6}$/, VALIDATION_ERRORS.invalid.pincodeDigits)
      .required(VALIDATION_ERRORS.required.pincode),
    contact_person_name: safeString()
      .trim()
      .required(VALIDATION_ERRORS.required.contactPerson)
      .matches(/^[^0-9]+$/, VALIDATION_ERRORS.invalid.contactPersonNumbers),

    products: Yup.object()
      .shape(productsShape)
      .test(
        'at-least-one-selected',
        'Please select at least one product',
        (obj) => productList.some(({ key }) => obj?.[key])
      ),
  });
};

export const MSME_PRODUCT_LIST = [
  { key: 'HR_coil', label: 'HR coil' },
  { key: 'Plates', label: 'Plates' },
  { key: 'CRFH_coil', label: 'CRFH coil' },
  { key: 'TMT', label: 'TMT' },
  { key: 'wire_rods', label: 'Wire rods' },
  { key: 'HRPO_coils', label: 'HRPO coils' },
  { key: 'HRSPO_coils', label: 'HRSPO coils' },
  { key: 'rails', label: 'Rails' },
  { key: 'structures', label: 'Structures' },
  { key: 'hollow_section', label: 'Hollow section' },
  { key: 'cement', label: 'Cement' },
];
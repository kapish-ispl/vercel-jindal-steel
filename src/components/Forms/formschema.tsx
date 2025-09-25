import * as Yup from "yup";

// --- Regular Expressions ---
const phoneRegExp = /^[6-9]\d{9}$/;
const yearRegExp = /^(194[5-9]|19[5-9]\d|20\d{2})$/;
const percentageRegExp = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
const pincodeRegExp = /^[1-9][0-9]{5}$/;

// --- TypeScript Interfaces for Type Safety ---

// Interface for the simple contact form
export interface IFormSchema {
  fullname: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  user_captcha_input: string;
}

// Interface for the education details array
export interface IEducationDetail {
  degree_name: string;
  passing_year: string;
  percentage: string;
}

// Interface for the experience details array
export interface IExperienceDetail {
  organization_name: string;
  designation: string;
  joining_date: Date | null;
  relieving_date: Date | null;
  job_profile: string;
  is_current_employment: string;
}

// Interface for the main job application form
export interface IJobApplicationSchema {
  isTalentForm: boolean;
  current_openings?: string;
  skills?: string;
  department?: string;
  other_department?: string;
  location?: string;
  name: string;
  dob: Date | null;
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
  email: string;
  address: string;
  city_name: string;
  resume_id: string;
  user_captcha_input: string;
  education_details: IEducationDetail[];
  experience_details?: IExperienceDetail[];
}

export interface IQueryFormSchema {
  full_Name: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  message: string;
  privacy_Policy: boolean;
}


// --- Type-Safe Schemas ---

// Schema for the simple form
export const FormSchema: Yup.ObjectSchema<IFormSchema> = Yup.object({
  fullname: Yup.string().required("Enter your Full Name"),
  email: Yup.string().email("Invalid email format").required("Enter your Email Id"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Enter a valid 10-digit Mobile Number")
    .required("Mobile Number is required"),
  country: Yup.string().required("Enter Country Name"),
  city: Yup.string().required("Enter City Name"),
  user_captcha_input: Yup.string().required("Captcha is required"),
});


// Schema for the detailed job application
export const JobApplicationSchema: Yup.ObjectSchema<IJobApplicationSchema> = Yup.object({
  isTalentForm: Yup.boolean().required(), // Added for clarity
  current_openings: Yup.string().when("isTalentForm", {
    is: false, // More direct and type-safe than using a function
    then: (schema) => schema.required("Select Current Openings").trim(),
  }),
  skills: Yup.string().when("isTalentForm", {
    is: true,
    then: (schema) => schema.required("Enter Sub function or Specialty").trim(),
  }),
  department: Yup.string().when("isTalentForm", {
    is: true,
    then: (schema) => schema.required("Select Department"),
  }),
  other_department: Yup.string().when("department", {
    is: "Others",
    then: (schema) => schema.required("Enter Other Department").trim(),
  }),
  location: Yup.string().when("isTalentForm", {
    is: false,
    then: (schema) => schema.required("Select Location"),
  }),
  name: Yup.string().required("Enter your Name"),
  dob: Yup.date()
    .nullable() // Allow null as an initial value
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "You must be at least 18 years old")
    .required("Enter your Date of Birth"),
  gender: Yup.string().required("Select your Gender").trim(),
  total_experience: Yup.string().required("Select your Experience").trim(),
  other_experience: Yup.string().when("total_experience", {
    is: "15+", // Assuming '15' means 15+
    then: (schema) => schema.required("Please specify your experience").trim(),
  }),
  notice_period: Yup.string().when("total_experience", {
    is: (val: string) => val !== "0", // Check if experience is not "Fresher"
    then: (schema) => schema.required("Select your Notice Period").trim(),
  }),
  nationality: Yup.string().required("Select your Nationality").trim(),
  country_name: Yup.string().required("Select your Country Name").trim(),
  state_name: Yup.string().required("Enter your State Name").trim(),
  other_state_name: Yup.string().when("state_name", {
    is: "Others",
    then: (schema) => schema.required("Enter your Other State Name").trim(),
  }),
  pincode: Yup.string()
    .matches(pincodeRegExp, "Enter a valid Pincode")
    .required("Enter your Pincode")
    .trim(),
  std_code: Yup.string()
    .matches(/^\+\d{1,4}$/, "Enter a valid Country Code (e.g., +91)")
    .required("Enter your Country Code")
    .trim(),
  mobile_number: Yup.string()
    .matches(phoneRegExp, "Enter a valid 10-digit Mobile Number")
    .required("Mobile Number is required")
    .trim(),
  alternate_mobile_number: Yup.string()
    .matches(phoneRegExp, "Enter a valid 10-digit Mobile Number")
    .trim(),
  email: Yup.string().email("Invalid email format").required("Enter your Email Id").trim(),
  address: Yup.string().required("Enter your Address").trim(),
  city_name: Yup.string().required("Enter your City Name").trim(),
  resume_id: Yup.string().required("Please upload your resume").trim(),
  user_captcha_input: Yup.string().required("Captcha is required").trim(),
  education_details: Yup.array()
    .of(
      Yup.object({
        degree_name: Yup.string().required("Enter your Board/Degree Name").trim(),
        passing_year: Yup.string()
          .matches(yearRegExp, "Enter a valid Passing Year")
          .required("Enter your Passing Year")
          .trim(),
        percentage: Yup.string()
          .matches(percentageRegExp, "Enter a valid Percentage (e.g., 85.5)")
          .required("Enter your Percentage")
          .trim(),
      })
    )
    .default([]) // This ensures the field is never undefined, fixing the type error
    .min(1, "At least one education detail is required"), // Added for robustness
  experience_details: Yup.array().when("total_experience", {
    is: (val: string) => val !== "0",
    then: (schema) =>
      schema.of(
        Yup.object({
          organization_name: Yup.string().required("Enter your Organization Name").trim(),
          designation: Yup.string().required("Enter your Designation").trim(),
          joining_date: Yup.date()
            .nullable()
            .max(new Date(), "Joining date cannot be in the future")
            .required("Enter your Joining Date"),
          relieving_date: Yup.date()
            .nullable()
            .required("Relieving Date is required")
            // Use a fully type-safe custom test
            .test(
              "is-greater",
              "Relieving Date must be after Joining Date",
              function (value) {
                // `this.parent` is now correctly typed as IExperienceDetail
                const { joining_date } = this.parent as IExperienceDetail;
                if (!value || !joining_date) return true;
                return value > joining_date;
              }
            ),
          job_profile: Yup.string().required("Enter your Job Profile").trim(),
          is_current_employment: Yup.string().required("Select your current Employment").trim(),
        })
      )
        .min(1, "At least one experience detail is required"),
  }),
});

export const QueryFormSchema: Yup.ObjectSchema<IQueryFormSchema> = Yup.object({
  full_Name: Yup.string()
    .trim()
    .min(2, 'Name is too short')
    .required('Full Name is required'),
  company: Yup.string().trim(),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),
  mobile: Yup.string()
    .trim()
    .matches(phoneRegExp, 'Please enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  country: Yup.string()
    .trim()
    .required('Country is required'),
  city: Yup.string()
    .trim()
    .required('City is required'),
  message: Yup.string()
    .trim()
    .required('Message is required'),
  // inquiry_Type: Yup.string()
  //   .oneOf(['sales', 'billing', 'support', ''], 'Please select a valid inquiry type'),
  inquiry_Type: Yup.string(),
  privacy_Policy: Yup.boolean()
    .oneOf([true], 'You must accept the privacy policy to continue')
    .required(),
})
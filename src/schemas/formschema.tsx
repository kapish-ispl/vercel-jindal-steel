import * as Yup from "yup";

const phoneRegExp = /^[6-9]\d{9}$/gi;
const yearRegExp = /^(194[5-9]|19[5-9]\d|200\d|201\d|202[0-4])$/;
const percentageRegExp =
  /^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?%?)$/;
const pincodeRegExp = /^[1-9][0-9]{5}$/;
//const countryRegExp = /^[1-9][0-9]{7}$/;
//const yearRegExp = /^(19\d\d|20\d\d|2[01]\d{2}|202[0-4])$/;;

export const FormSchema = Yup.object({
  fullname: Yup.string().required("Enter your Full Name"),
  email: Yup.string().email().required("Enter your Email Id"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Enter valid Mobile Number")
    .required("Enter valid Mobile Number"),
  country: Yup.string().required("Enter Country Name"),
  city: Yup.string().required("Enter City Name"),
  user_captcha_input: Yup.string().required("Captcha is required"),
});

export const JobApplicationSchema = Yup.object({
  current_openings: Yup.string().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == false,
    then: () => Yup.string().required("Select Current Openings").trim(),
  }),
  skills: Yup.string().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => Yup.string().required("Enter Sub function or Specialty").trim(),
  }),
  department: Yup.string().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == true,
    then: () => Yup.string().required("Select Department"),
  }),
  other_department: Yup.string().when("department", {
    is: (department: any) => department == "Others",
    then: () => Yup.string().required("Enter Other Department").trim(),
  }),
  location: Yup.string().when("isTalentForm", {
    is: (isTalentForm: any) => isTalentForm == false,
    then: () => Yup.string().required("Select Location"),
  }),
  name: Yup.string().required("Enter your Name"),
  dob: Yup.date()
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years")
    .required("Enter your Date of Birth"),
  gender: Yup.string().required("Enter your Gender").trim(),
  total_experience: Yup.string().required("Enter your Experience").trim(),
  other_experience: Yup.string().when("total_experience", {
    is: (total_experience: any) => total_experience == "15",
    then: () => Yup.string().required("Enter your Experience").trim(),
  }),
  // current_ctc: Yup.string().when("total_experience", { is: (total_experience: any) => total_experience != "0", then: () => Yup.string().required("Enter your Current CTC") }),
  // expected_ctc: Yup.string().when("total_experience", { is: (total_experience: any) => total_experience != "0", then: () => Yup.string().required("Enter your Expected CTC") }),
  notice_period: Yup.string().when("total_experience", {
    is: (total_experience: any) => total_experience != "0",
    then: () => Yup.string().required("Enter your Notice Period").trim(),
  }),
  nationality: Yup.string().required("Select your Nationality").trim(),
  country_name: Yup.string().required("Select your Country Name").trim(),
  state_name: Yup.string().required("Enter your State Name").trim(),
  other_state_name: Yup.string().when("state_name", {
    is: (state_name: any) => state_name == "Others",
    then: () => Yup.string().required("Enter your Other State Name").trim(),
  }),
  pincode: Yup.string()
    .matches(pincodeRegExp, "Enter valid Pincode")
    .required("Enter your Pincode")
    .trim(),
  std_code: Yup.string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Enter valid Country Code"
    )
    .required("Enter your Country Code")
    .trim(),
  mobile_number: Yup.string()
    .matches(phoneRegExp, "Enter valid Mobile Number")
    .required("Enter valid Mobile Number")
    .trim(),
  alternate_mobile_number: Yup.string()
    .matches(phoneRegExp, "Enter valid Mobile Number")
    .trim(),
  email: Yup.string().email().required("Enter your Email Id").trim(),
  address: Yup.string().required("Enter your Address").trim(),
  city_name: Yup.string().required("Enter your City Name").trim(),
  resume_id: Yup.string().required("Upload your resume").trim(),
  user_captcha_input: Yup.string().required("Captcha is required").trim(),
  education_details: Yup.array().of(
    Yup.object().shape({
      degree_name: Yup.string().required("Enter your Board/Degree Name").trim(),
      passing_year: Yup.string()
        .matches(yearRegExp, "Enter your Passing Year")
        .required("Enter your Passing Year")
        .trim(),
      percentage: Yup.string()
        .matches(percentageRegExp, "Enter your Percentage")
        .required("Enter your Percentage")
        .trim(),
    })
  ),
  experience_details: Yup.array().when("total_experience", {
    is: (total_experience: any) => total_experience != "0",
    then: () =>
      Yup.array().of(
        Yup.object().shape({
          organization_name: Yup.string()
            .required("Enter your Organization Name")
            .trim(),
          designation: Yup.string().required("Enter your Designation").trim(),
          joining_date: Yup.date()
            .max(new Date(Date.now()))
            .required("Enter your Joining Date"),
          relieving_date: Yup.date()
            .required("Relieving Date is required")
            .test(
              "is-greater",
              "Relieving Date must be at least 30 days after Joining Date",
              function (value) {
                const { joining_date } = this.parent; // Access the parent object
                if (!value || !joining_date) return true; // If either date is not provided, skip validation
                const joiningDate = new Date(joining_date);
                const requiredRelievingDate = new Date(joiningDate);
                requiredRelievingDate.setDate(joiningDate.getDate() + 30); // Add 30 days to the joining date
                return value >= requiredRelievingDate; // Check if relieving date is at least 30 days after joining date
              }
            ),
          job_profile: Yup.string().required("Enter your Job Profile").trim(),
          is_current_employment: Yup.string()
            .required("Select your current Employment")
            .trim(),
        })
      ),
  }),
});

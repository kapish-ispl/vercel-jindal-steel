import { FieldArray, Form, getIn, Formik } from "formik";
import { JobApplicationSchema } from "./formschema";
import { useState, useEffect, useContext } from "react";
import {
    POST_JOB_ENDPOINT,
    GET_FILE_UPLOAD_ENDPOINT,
} from "@/config/apiConfig";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { Captcha, validateCaptcha } from "../Captcha";
import { AppContext } from "@/context/AppContext";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FormDatePicker from "./FormDatePicker";
import { useRouter } from "next/navigation";
import { postUploadFileResponse, postAPIResponse } from "@/services/apiRequests";
import FormMultiSelect from "./FormMultiSelect";


const JobForm = () => {
    const contextInfo = useContext(AppContext);
    const router = useRouter();
    const [showInputBox, setShowInputBox] = useState(false);
    const [showExpericeFields, setShowExpericeFields] = useState(true);
    const [selectedCountryIndia, setSelectedCountryIndia] = useState(false);
    const [selectedStateOther, setSelectedStateOther] = useState(false);
    const [maxDateState, setMaxDateState] = useState("01-29-2024");
    const [alertMsg, setAlertMsg] = useState("");
    const [submitMsg, setSubmitMsg] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [actualCaptcha, setActualCaptcha] = useState<string>('');
    const [reloadCaptcha, setReloadCaptcha] = useState<boolean>(false);
    const [captchaKey, setCaptchaKey] = useState<number>(0);

    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!contextInfo.jobPostId || !contextInfo.jobCode || !contextInfo.jobTitle) {
            setIsRedirecting(true);
            router.push("/career-v2");
        }
    }, [contextInfo.jobPostId, contextInfo.jobCode, contextInfo.jobTitle, router]);

    const experienceOptions = [
        { value: "0", label: "Fresher" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15+" },
    ];

    const keySkillsOptions = [
        { value: "React", label: "React" },
        { value: "Node.js", label: "Node.js" },
        { value: "TypeScript", label: "TypeScript" },
        { value: "Next.js", label: "Next.js" },
        { value: "SASS", label: "SASS" },
    ];

    const educationLabels = [

        "10th",
        "12th",
        "Graduation",
        "Post Graduation",
        "Others",
    ];

    const currentEmploymentOptions = [
        { value: "0", label: "No" },
        { value: "1", label: "Yes" },
    ];

    const initialValues = {
        post_id:
            contextInfo.jobPostId !== "" && contextInfo.jobPostId !== undefined
                ? Number(contextInfo.jobPostId)
                : "",
        job_code:
            contextInfo.jobCode !== "" && contextInfo.jobCode !== undefined
                ? contextInfo.jobCode
                : "",
        current_openings:
            contextInfo.jobTitle !== "" && contextInfo.jobTitle !== undefined
                ? `${contextInfo.jobRole}${contextInfo.jobRole && ' ,'}${contextInfo.jobTitle}`
                : "",
        location:
            contextInfo.jobLocation !== "" && contextInfo.jobLocation !== undefined
                ? contextInfo.jobLocation
                : "",
        name: "",
        dob: null,
        email: "",
        alternate_email: "",
        gender: "",
        total_experience: "",
        other_experience: "",
        notice_period: "",
        nationality: "",
        country_name: "",
        state_name: "",
        other_state_name: "",
        pincode: "",
        std_code: "",
        mobile_number: "",
        alternate_mobile_number: "",
        address: "",
        country_of_residence: "India",
        city_name: "",
        key_skills: [],
        resume_id: "",
        user_captcha_input: "",
        education_details: [
            {
                degree_name: "",
                course_name: "",
                institute_name: "",
                university_name: "",
                passing_year: "",
                percentage: "",
            },
        ],
        experience_details: [
            {
                organization_name: "",
                designation: "",
                joining_date: null,
                job_profile: "",
                relieving_date: null,
                is_current_employment: "",
            },
        ],
    };

    const handleSubmitData = async (data: any) => {
        const response = await postAPIResponse(POST_JOB_ENDPOINT, data);
        if (response?.code == "SUC200") {
            // router.push("/thanks");
        } else {
            setSubmitSuccess(false);
            setSubmitMsg(true);
            setAlertMsg(response?.message || "Something went wrong while submitting the form.");
            contextInfo.setIsLoading(false);
        }
    };

    useEffect(() => {
        if (reloadCaptcha) {
            setCaptchaKey((prev) => prev + 1);
        }
    }, [reloadCaptcha]);


    return (
        <div className="form_container c-form">
            <Formik
                initialValues={initialValues}
                validationSchema={JobApplicationSchema}
                enableReinitialize={true}
                onSubmit={(values, action) => {
                    const formValues = { ...values };

                    if (formValues.total_experience == "15") {
                        formValues.total_experience = formValues.other_experience;
                    } else if (formValues.total_experience == "0") {
                        formValues.experience_details = [];
                    }

                    const {
                        current_openings,
                        location,
                        other_experience,
                        user_captcha_input,
                        job_code,
                        ...submittedValue
                    } = formValues;

                    const submittedData = formValues.total_experience === "0"
                        ? { ...submittedValue, experience_details: [] }
                        : submittedValue;

                    console.log("Form Submitted. Values processed:", formValues);
                    console.log("Final data to be sent:", submittedData);

                    if (validateCaptcha(user_captcha_input, actualCaptcha)) {
                        console.log("Captcha validated successfully.");
                        setReloadCaptcha(prev => !prev);
                        contextInfo.setIsLoading(true);
                        handleSubmitData(submittedData);
                        if (submitSuccess) {
                            setTimeout(() => {
                                action.resetForm();
                                contextInfo.setIsLoading(false);
                            }, 3000);
                        }
                    } else {
                        setSubmitSuccess(false);
                        setSubmitMsg(true);
                        setAlertMsg("Captcha Does Not Match");
                        setTimeout(() => {
                            setSubmitMsg(false);
                        }, 3000);
                    }
                }}
            >
                {({
                    values,
                    touched,
                    errors,
                    setFieldValue,
                    handleSubmit,
                }) => {
                    const noticePeriodHandler = (e: any) => {
                        setFieldValue("notice_period", e.target.value);
                        let maxDate = new Date(
                            Date.now() +
                            Number(e.target.value) * 24 * 60 * 60 * 1000
                        );
                        setMaxDateState(
                            `${maxDate.getMonth() + 1}-${maxDate.getDate()}-${maxDate.getFullYear()}`
                        );
                    };

                    const handleExperienceChange = (selectedValue: any) => {
                        selectedValue.value == "0"
                            ? setShowExpericeFields(false)
                            : setShowExpericeFields(true);
                        selectedValue.value == "15"
                            ? setShowInputBox(true)
                            : setShowInputBox(false);
                    };

                    const handleCountryChange = (selectedValue: any) => {
                        selectedValue.value == "India"
                            ? setSelectedCountryIndia(true)
                            : setSelectedCountryIndia(false);
                    };

                    const handleStateChange = (selectedValue: any) => {
                        selectedValue.value == "Others"
                            ? setSelectedStateOther(true)
                            : setSelectedStateOther(false);
                    };

                    const handleFileChange = (selectedFile: any) => {
                        let fileData = selectedFile.currentTarget.files[0];
                        const getFileUploadInfo = async () => {
                            const response = await postUploadFileResponse(
                                `${GET_FILE_UPLOAD_ENDPOINT}`,
                                fileData
                            );
                            if (response && response.code === 'SUC200' && response.data?.media?.orig) {
                                setFieldValue("resume_id", response.data.media.orig);
                            } else {
                                console.error("File upload failed:", response);
                            }
                        };
                        getFileUploadInfo();
                    };

                    return (
                        <Form onSubmit={handleSubmit}>
                            {/* ------ Job Details ------ */}
                            <div className="row form_grider v1">
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Job Position*"
                                        name="current_openings"
                                        error={errors.current_openings}
                                        touched={touched.current_openings}
                                        autoComplete="off"
                                        readOnly={true}
                                        showLabel={true}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Job Code*"
                                        name="job_code"
                                        error={errors.job_code}
                                        touched={touched.job_code}
                                        autoComplete="off"
                                        readOnly={true}
                                        showLabel={true}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Job Location*"
                                        name="location"
                                        error={errors.location}
                                        touched={touched.location}
                                        autoComplete="off"
                                        readOnly={true}
                                        showLabel={true}
                                    />
                                </div>
                            </div>
                            <div className="c-divider">&nbsp;</div>
                            {/* ------ Personal Details ------ */}
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="cus_text30 text-orange withborder">
                                        Personal Details
                                    </h3>
                                </div>
                            </div>
                            <div className="row form_grider v1">
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Name*"
                                        name="name"
                                        error={errors.name}
                                        touched={touched.name}
                                        maxLength={50}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <FormDatePicker
                                        label="Date of Birth*"
                                        name="dob"
                                        error={errors.dob as string}
                                        touched={touched.dob}
                                        placeholderText="DOB"
                                        minDate={new Date("1945/08/15")}
                                        maxDate={new Date()}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Email*"
                                        name="email"
                                        type="email"
                                        error={errors.email}
                                        touched={touched.email}
                                        maxLength={50}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Alternate Email"
                                        name="alternate_email"
                                        type="email"
                                        maxLength={50}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <FormMultiSelect
                                        label="Select Gender*"
                                        name="gender"
                                        options={contextInfo.genderOptions || []}
                                        placeholder="Select Gender"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <FormMultiSelect
                                        label="Experience (Years)*"
                                        name="total_experience"
                                        options={experienceOptions}
                                        placeholder="Select Experience in Year"
                                        onChange={handleExperienceChange}
                                    />
                                </div>

                                {showInputBox && (
                                    <div className="col-12 col-md-4">
                                        <FormField
                                            label="Other Experience"
                                            name="other_experience"
                                            error={errors.other_experience}
                                            touched={touched.other_experience}
                                            maxLength={2}
                                            autoComplete="off"
                                        />
                                    </div>
                                )}

                                {showExpericeFields && (
                                    <div className="col-12 col-md-4">
                                        <FormField
                                            label="Notice Period (Days)"
                                            name="notice_period"
                                            error={errors.notice_period}
                                            touched={touched.notice_period}
                                            autoComplete="off"
                                            onChange={noticePeriodHandler}
                                            maxLength={3}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="c-divider">&nbsp;</div>
                            {/* ------ Educational Details ------ */}
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="cus_text30 text-orange withborder">
                                        Educational Details
                                    </h3>
                                </div>
                            </div>
                            <div className="row form_grider v1">
                                <FieldArray
                                    name="education_details"
                                    render={(arrayHelpers) => {
                                        const education_details = values.education_details;
                                        const canAddMore = educationLabels.length > education_details.length;
                                        return (
                                            <div>
                                                {education_details.map((_edu, index) => (
                                                    <div key={index}>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between filter_withBtn">
                                                                    <p className="cus_text24 mb-4 mt-4">
                                                                        {educationLabels[index] || "Others"}
                                                                    </p>
                                                                    {index > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            className="cus_btn2 no_zIndex orange"
                                                                            onClick={() => arrayHelpers.remove(index)}
                                                                        >
                                                                            <span>Delete</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12 col-md-4">
                                                                <FormField
                                                                    label={educationLabels[index] === "10th" || educationLabels[index] === "12th" ? "Board Name*" : "Degree Name*"}
                                                                    name={`education_details.${index}.degree_name`}
                                                                    error={getIn(errors, `education_details.${index}.degree_name`)}
                                                                    touched={getIn(touched, `education_details.${index}.degree_name`)}
                                                                    autoComplete="off"
                                                                    maxLength={50}
                                                                />
                                                            </div>
                                                            {educationLabels[index] !== "10th" && educationLabels[index] !== "12th" && (
                                                                <>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="Course Name*"
                                                                            name={`education_details.${index}.course_name`}
                                                                            error={getIn(errors, `education_details.${index}.course_name`)}
                                                                            touched={getIn(touched, `education_details.${index}.course_name`)}
                                                                            autoComplete="off"
                                                                            maxLength={50}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="Institute Name*"
                                                                            name={`education_details.${index}.institute_name`}
                                                                            error={getIn(errors, `education_details.${index}.institute_name`)}
                                                                            touched={getIn(touched, `education_details.${index}.institute_name`)}
                                                                            autoComplete="off"
                                                                            maxLength={50}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="University Name*"
                                                                            name={`education_details.${index}.university_name`}
                                                                            error={getIn(errors, `education_details.${index}.university_name`)}
                                                                            touched={getIn(touched, `education_details.${index}.university_name`)}
                                                                            autoComplete="off"
                                                                            maxLength={50}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="col-12 col-md-4">
                                                                <FormField
                                                                    label="Passing Year*"
                                                                    name={`education_details.${index}.passing_year`}
                                                                    error={getIn(errors, `education_details.${index}.passing_year`)}
                                                                    touched={getIn(touched, `education_details.${index}.passing_year`)}
                                                                    autoComplete="off"
                                                                    maxLength={4}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <FormField
                                                                    label="Percentage*"
                                                                    name={`education_details.${index}.percentage`}
                                                                    error={getIn(errors, `education_details.${index}.percentage`)}
                                                                    touched={getIn(touched, `education_details.${index}.percentage`)}
                                                                    autoComplete="off"
                                                                    maxLength={5}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {canAddMore && (
                                                    <div className="d-flex">
                                                        <button
                                                            type="button"
                                                            className="cus_btn2 no_zIndex orange"
                                                            onClick={() =>
                                                                arrayHelpers.push({
                                                                    degree_name: "",
                                                                    course_name: "",
                                                                    institute_name: "",
                                                                    university_name: "",
                                                                    passing_year: "",
                                                                    percentage: "",
                                                                })
                                                            }
                                                        >
                                                            <span>Add More</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                />
                            </div>

                            {/* ------ Employment Details ------ */}
                            {showExpericeFields && (
                                <>
                                    <div className="c-divider">&nbsp;</div>
                                    <div className="row">
                                        <div className="col-12">
                                            <h3 className="cus_text30 text-orange withborder">
                                                Employment Details
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="row form_grider v1">
                                        <FieldArray
                                            name="experience_details"
                                            render={(arrayHelpers) => {
                                                const experience_details = values.experience_details;
                                                return (
                                                    <div>
                                                        {experience_details.map((_exp, index) => (
                                                            <div key={index}>
                                                                {index > 0 && (
                                                                    <div className="row">
                                                                        <div className="col-12 d-flex justify-content-end">
                                                                            <button
                                                                                type="button"
                                                                                className="cus_btn2 mb-4 mt-4 no_zIndex orange"
                                                                                onClick={() => arrayHelpers.remove(index)}
                                                                            >
                                                                                <span>Delete</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="row">
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="Organization Name*"
                                                                            name={`experience_details.${index}.organization_name`}
                                                                            error={getIn(errors, `experience_details.${index}.organization_name`)}
                                                                            touched={getIn(touched, `experience_details.${index}.organization_name`)}
                                                                            autoComplete="off"
                                                                            maxLength={50}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="Designation*"
                                                                            name={`experience_details.${index}.designation`}
                                                                            error={getIn(errors, `experience_details.${index}.designation`)}
                                                                            touched={getIn(touched, `experience_details.${index}.designation`)}
                                                                            autoComplete="off"
                                                                            maxLength={30}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormDatePicker
                                                                            label="Joining Date*"
                                                                            name={`experience_details.${index}.joining_date`}
                                                                            error={getIn(errors, `experience_details.${index}.joining_date`)}
                                                                            touched={getIn(touched, `experience_details.${index}.joining_date`)}
                                                                            placeholderText="Joining Date"
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            maxDate={new Date()}
                                                                            dropdownMode="select"
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormField
                                                                            label="Job Profile*"
                                                                            name={`experience_details.${index}.job_profile`}
                                                                            error={getIn(errors, `experience_details.${index}.job_profile`)}
                                                                            touched={getIn(touched, `experience_details.${index}.job_profile`)}
                                                                            autoComplete="off"
                                                                            maxLength={150}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormDatePicker
                                                                            label="Relieving Date"
                                                                            name={`experience_details.${index}.relieving_date`}
                                                                            error={getIn(errors, `experience_details.${index}.relieving_date`)}
                                                                            touched={getIn(touched, `experience_details.${index}.relieving_date`)}
                                                                            placeholderText="Relieving Date"
                                                                            maxDate={new Date(maxDateState)}
                                                                            showMonthDropdown
                                                                            showYearDropdown
                                                                            dropdownMode="select"
                                                                            autoComplete="off"
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <FormMultiSelect
                                                                            label="Currently Employed*"
                                                                            name={`experience_details.${index}.is_current_employment`}
                                                                            options={currentEmploymentOptions}
                                                                            placeholder="Currently Employed"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="d-flex">
                                                            <button
                                                                type="button"
                                                                className="cus_btn2 no_zIndex orange"
                                                                onClick={() =>
                                                                    arrayHelpers.push({
                                                                        organization_name: "",
                                                                        designation: "",
                                                                        joining_date: null,
                                                                        job_profile: "",
                                                                        relieving_date: null,
                                                                        is_current_employment: "",
                                                                    })
                                                                }
                                                            >
                                                                <span>Add More</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="c-divider">&nbsp;</div>
                            {/* ------ Contact & Address ------ */}
                            <div className="row">
                                <div className="col-12">
                                    <h3 className="cus_text30 text-orange withborder">
                                        Contact &amp; Address
                                    </h3>
                                </div>
                            </div>
                            <div className="row form_grider v1">
                                <div
                                    className={`col-12 ${selectedCountryIndia ? selectedStateOther ? "col-md-4" : "col-md-6" : "col-md-6"}`}
                                >
                                    <FormMultiSelect
                                        label="Select Country*"
                                        name="country_name"
                                        options={contextInfo.countryOptions || []}
                                        placeholder="Select Country"
                                        onChange={handleCountryChange}
                                    />
                                </div>
                                {selectedCountryIndia ? (
                                    <div
                                        className={`col-12 ${selectedStateOther ? "col-md-4" : "col-md-6"}`}
                                    >
                                        <FormMultiSelect
                                            label="Select State*"
                                            name="state_name"
                                            options={contextInfo.statesOptions || []}
                                            placeholder="Select State"
                                            onChange={handleStateChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="col-12 col-md-6">
                                        <FormField
                                            label="State Name"
                                            name="state_name"
                                            error={errors.state_name}
                                            touched={touched.state_name}
                                            autoComplete="off"
                                            maxLength={30}
                                        />
                                    </div>
                                )}
                                {selectedStateOther && (
                                    <div className="col-12 col-md-4">
                                        <FormField
                                            label="Other State Name"
                                            name="other_state_name"
                                            error={errors.other_state_name}
                                            touched={touched.other_state_name}
                                            autoComplete="off"
                                            maxLength={30}
                                        />
                                    </div>
                                )}
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="City Name"
                                        name="city_name"
                                        error={errors.city_name}
                                        touched={touched.city_name}
                                        autoComplete="off"
                                        maxLength={30}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormMultiSelect
                                        label="Nationality*"
                                        name="nationality"
                                        options={contextInfo.nationalityOptions || []}
                                        placeholder="Select Nationality"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Pincode"
                                        name="pincode"
                                        error={errors.pincode}
                                        touched={touched.pincode}
                                        autoComplete="off"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Country Code*"
                                        name="std_code"
                                        error={errors.std_code}
                                        touched={touched.std_code}
                                        autoComplete="off"
                                        maxLength={3}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Mobile Number*"
                                        name="mobile_number"
                                        error={errors.mobile_number}
                                        touched={touched.mobile_number}
                                        maxLength={10}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <FormField
                                        label="Alternate Mobile Number"
                                        name="alternate_mobile_number"
                                        maxLength={10}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-12">
                                    <FormField
                                        label="Address"
                                        name="address"
                                        type="textarea"
                                        error={errors.address}
                                        touched={touched.address}
                                        maxLength={150}
                                    />
                                </div>
                            </div>

                            {/* ------ Resume Upload ------ */}
                            <div className="row form_grider v1">
                                <div className="col-12">
                                    <p className="cus_text20 mb-2">
                                        Upload Your Resume (Type: .doc, .docx, .pdf)
                                    </p>
                                    <div
                                        className={`form_grider_wrap ${touched.resume_id && errors.resume_id ? "hasError" : ""}`}
                                    >
                                        <input
                                            name="resume_id"
                                            type="file"
                                            accept=".pdf,.doc,.docx,.rtf"
                                            onChange={(value) => handleFileChange(value)}
                                        />
                                        {touched.resume_id && errors.resume_id ? (
                                            <p className="form_grider_wrap_helper">
                                                {errors.resume_id}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* ------ Captcha ------ */}
                            <div className="row form_grider v1">
                                <div className="col-12 col-md-6">
                                    <div className="form_captcha_wrap">
                                        <Captcha
                                            key={captchaKey}
                                            numberOfCharacters={6}
                                            backgroundColor="#c2c2c2"
                                            fontColor="#333"
                                            onChange={setActualCaptcha}
                                            setReloadCaptcha={setReloadCaptcha}
                                        />
                                        <FormField
                                            label="Enter Captcha*"
                                            name="user_captcha_input"
                                            error={errors.user_captcha_input}
                                            touched={touched.user_captcha_input}
                                            maxLength={6}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ------ Alert & Submit ------ */}
                            {submitMsg && (
                                <div className="row">
                                    <div className="col-12">
                                        <div
                                            className="p-4 mb-4 mt-4 cus_text24 text-white rounded-lg bg-orange"
                                            role="alert"
                                        >
                                            <span className="font-medium">
                                                {alertMsg !== ""
                                                    ? alertMsg
                                                    : "Something went wrong, please try again later."}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-12">
                                    <div className="button_wrap d-flex">
                                        <button
                                            type="submit"
                                            className="cus_btn2 no_zIndex orange"
                                        >
                                            <span>SUBMIT APPLICATION</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>

    );
};

export default JobForm;

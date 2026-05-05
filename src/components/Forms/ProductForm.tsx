import React, { FC, useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import FormField from './FormField';
import FormSelect from './FormSelect';
import FormDatePicker from './FormDatePicker';
import { restrictDigits, restrictEmailChars, restrictSpecialChar, validateMobile, handleCopyPaste } from './FormFunc';
import { Captcha } from '../Captcha';
import { QueryFormSchema } from './formschema';
import { POST_FORM_ENDPOINT } from '@/config/apiConfig';
import { serverRequest } from '@/services/getServerSideRender';
import { useRouter } from 'next/router';
import { CONSTANTS } from '@/config/constant';

interface FormValues {
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

const ProductForm: FC<{ pageTitle: string }> = ({ pageTitle }) => {
    console.log(pageTitle);
    const mobileRef = useRef<HTMLInputElement | null>(null);
    const [actualCaptcha, setActualCaptcha] = useState<string>('');
    const [reloadCaptcha, setReloadCaptcha] = useState<boolean>(false);
    const [captchaKey, setCaptchaKey] = useState<number>(0);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    // const router = useRouter();

    useEffect(() => {
        if (reloadCaptcha) {
            setCaptchaKey((prev) => prev + 1)
        }
    }, [reloadCaptcha])

    const initialValues: FormValues = {
        fullname: "",
        email: "",
        country: "",
        company: "",
        mobile: "",
        city: "",
        description: "",
        product: pageTitle,
        user_captcha_input: "",
    };
    const phoneRegExp = /^[6-9]\d{9}$/gi;

    const FormSchema = Yup.object({
        fullname: Yup.string().required("Enter your Full Name"),
        email: Yup.string().email().required("Enter your Email Id"),
        mobile: Yup.string()
            .matches(phoneRegExp, "Enter valid Mobile Number")
            .required("Enter valid Mobile Number"),
        company: Yup.string().required("Enter Company Name"),
        description: Yup.string().required("Enter your Description"),
        country: Yup.string().required("Enter Country Name"),
        city: Yup.string().required("Enter City Name"),
        user_captcha_input: Yup.string().required("Captcha is required"),
    });


    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        setSubmitMessage(null);

        const { ...submissionData } = values;

        const filteredSubmissionData = Object.fromEntries(
            Object.entries(submissionData).filter(([, value]) => value !== '')
        );

        const widgetData = {
            WidgetForm: { fields: filteredSubmissionData, widget_id: 308 },
        };

        console.log(widgetData, 'widgetData');

        try {
            const response = await serverRequest(widgetData, POST_FORM_ENDPOINT, CONSTANTS.REQUEST_POST);

            if (response.code === "SUC200") {
                console.log('form saved successfully')
                resetForm();
            } else {
                setSubmitMessage(response.message || 'An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error("API submission failed:", error);
            setSubmitMessage('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
            setReloadCaptcha(prevState => !prevState);
        }
    };

    const inquiryOptions = ['Male', 'Female', 'Not Disclosed'];

    return (
        <div className="form_container c-form">
            <Formik
                initialValues={initialValues}
                validationSchema={FormSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, values }) => (
                    <Form noValidate>
                        <div className="container cus-container">
                            <div className="row">

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="fullname"
                                        label="Full Name*"
                                        error={errors.fullname}
                                        touched={touched.fullname}
                                        onKeyDown={restrictSpecialChar}
                                    />
                                </div>

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="city"
                                        label="City*"
                                        error={errors.city}
                                        touched={touched.city}
                                    />
                                </div>

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="email"
                                        label="Email*"
                                        type="email"
                                        error={errors.email}
                                        touched={touched.email}
                                        onKeyDown={restrictEmailChars}
                                    />
                                </div>

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="company"
                                        label="Company*"
                                        error={errors.company}
                                        touched={touched.company}
                                    />
                                </div>

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="mobile"
                                        label="Mobile*"
                                        type="tel"
                                        error={errors.mobile}
                                        touched={touched.mobile}
                                        maxLength={10}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            restrictDigits(e);
                                            validateMobile(e, mobileRef);
                                        }}
                                        onPaste={handleCopyPaste}
                                        ref={mobileRef}
                                    />
                                </div>

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="country"
                                        label="Country*"
                                        error={errors.country}
                                        touched={touched.country}
                                    />
                                </div>

                                <div className="col-12">
                                    <FormField
                                        name="description"
                                        label="Message*"
                                        type="textarea"
                                        error={errors.description}
                                        touched={touched.description}
                                        rows={4}
                                    />
                                </div>

                                <div className="col-lg-6">
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
                                            name="user_captcha_input"
                                            label="Enter CAPTCHA"
                                            error={errors.user_captcha_input}
                                            touched={touched.user_captcha_input}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="form_submit_button" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>

                            </div>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProductForm;
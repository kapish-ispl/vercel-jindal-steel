import React, { FC, useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import FormField from './FormField';
import { restrictDigits, restrictEmailChars, restrictSpecialChar, validateMobile, handleCopyPaste } from './FormFunc';
import { Captcha } from '../Captcha';
import { QueryFormSchema } from './formschema';
import { POST_FORM_ENDPOINT } from '@/config/apiConfig';
import { serverRequest } from '@/services/getServerSideRender';
import { useRouter } from 'next/router';
import { CONSTANTS } from '@/config/constant';

interface FormValues {
    Product: string;
    full_Name: string;
    company: string;
    email: string;
    mobile: string;
    country: string;
    city: string;
    message: string;
    inquiry_Type: 'sales' | 'billing' | 'support' | '';
    privacy_Policy: boolean;
    captcha: string;
}

const ProductForm: FC<{ pageTitle: string }> = ({ pageTitle }) => {
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
        full_Name: '',
        company: '',
        email: '',
        mobile: '',
        country: '',
        city: '',
        message: '',
        inquiry_Type: '',
        privacy_Policy: false,
        Product: pageTitle,
        captcha: '',
    };
    const ExtendedSchema = QueryFormSchema.shape({
        captcha: Yup.string()
            .required('Captcha is required')
            .test(
                'match-captcha',
                'Captcha does not match',
                (value) => value === actualCaptcha
            ),
    });


    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        setSubmitMessage(null);

        const { captcha, ...submissionData } = values;

        const filteredSubmissionData = Object.fromEntries(
            Object.entries(submissionData).filter(([, value]) => value !== '')
        );

        const widgetData = {
            WidgetForm: { fields: filteredSubmissionData, widget_id: 308 },
        };

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

    const inquiryOptions = ['sales', 'billing', 'support'];

    return (
        <div className="form_container">
            <h1>Query & Feedback</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={ExtendedSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, values }) => (
                    <Form noValidate>
                        <Field
                            name="full_Name"
                            label="Full Name*"
                            as={FormField}
                            error={errors.full_Name}
                            touched={touched.full_Name}
                            onKeyDown={restrictSpecialChar}
                        />
                        <Field
                            name="company"
                            label="Company"
                            as={FormField}
                            error={errors.company}
                            touched={touched.company}
                        />
                        <Field
                            name="email"
                            label="Email*"
                            type="email"
                            as={FormField}
                            error={errors.email}
                            touched={touched.email}
                            onKeyDown={restrictEmailChars}
                        />
                        <Field
                            name="mobile"
                            label="Mobile*"
                            type="tel"
                            as={FormField}
                            error={errors.mobile}
                            touched={touched.mobile}
                            maxLength={10}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                restrictDigits(e);
                                validateMobile(e, mobileRef);
                            }}
                            onPaste={handleCopyPaste}
                            innerRef={mobileRef}
                        />
                        <Field
                            name="country"
                            label="Country*"
                            as={FormField}
                            error={errors.country}
                            touched={touched.country}
                            onKeyDown={restrictSpecialChar}
                        />
                        <Field
                            name="city"
                            label="City*"
                            as={FormField}
                            error={errors.city}
                            touched={touched.city}
                            onKeyDown={restrictSpecialChar}
                        />
                        <Field
                            name="message"
                            label="Message*"
                            type="textarea"
                            as={FormField}
                            error={errors.message}
                            touched={touched.message}
                            rows={4}
                        />

                        <div role="group" aria-labelledby="inquiry-type-heading" className="form_group_wrap">
                            <p id="inquiry-type-heading" className="form_group_label">What can we help you with?</p>
                            {inquiryOptions.map((type) => (
                                <Field
                                    key={type}
                                    name="inquiry_Type"
                                    type="radio"
                                    value={type}
                                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                                    as={FormField}
                                    checked={values.inquiry_Type === type}
                                />
                            ))}
                            <ErrorMessage name="inquiry_Type" component="p" className="form_grider_wrap_helper" />
                        </div>

                        <div className="form_captcha_wrap">
                            <Captcha
                                key={captchaKey}
                                numberOfCharacters={6}
                                backgroundColor="white"
                                fontColor="black"
                                onChange={setActualCaptcha}
                                setReloadCaptcha={setReloadCaptcha}
                            />
                            <Field
                                name="captcha"
                                label="Enter CAPTCHA"
                                as={FormField}
                                error={errors.captcha}
                                touched={touched.captcha}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form_checkbox_wrap">
                            <Field
                                type="checkbox"
                                name="privacy_Policy"
                                id="privacyPolicy"
                                className="form_checkbox_field"
                            />
                            <label htmlFor="privacyPolicy" className="form_checkbox_label">
                                I have read and understood the Privacy Policy.
                            </label>
                            <ErrorMessage name="privacy_Policy" component="p" className="form_grider_wrap_helper" />
                        </div>

                        <button type="submit" className="form_submit_button" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Query'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProductForm;
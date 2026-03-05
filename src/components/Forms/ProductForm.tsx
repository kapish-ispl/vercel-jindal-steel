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
    Product: string;
    full_Name: string;
    company: string;
    email: string;
    mobile: string;
    country: string;
    city: string;
    message: string;
    inquiry_Type: 'sales' | 'billing' | 'support' | '';
    preferred_date: string | null;
    subject: string;
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
        preferred_date: null,
        subject: '',
        privacy_Policy: false,
        Product: pageTitle,
        captcha: '',
    };
    const ExtendedSchema = QueryFormSchema.shape({
        subject: Yup.string().required('Subject is required'),
        preferred_date: Yup.date().nullable().required('Preferred date is required'),
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
        <div className="form_container c-form">
            <Formik
                initialValues={initialValues}
                validationSchema={ExtendedSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, values }) => (
                    <Form noValidate>
                        <div className="container cus-container">
                            <div className="row">

                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormField
                                        name="full_Name"
                                        label="Full Name*"
                                        error={errors.full_Name}
                                        touched={touched.full_Name}
                                        onKeyDown={restrictSpecialChar}
                                    />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <FormDatePicker
                                        name="preferred_date"
                                        label="Preferred Date*"
                                        placeholder="Select Preferred Date"
                                        error={errors.preferred_date}
                                        touched={touched.preferred_date}
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
                                <div className="col-lg-6 col-md-12">
                                    <FormField
                                        name="email"
                                        label="Email*"
                                        type="email"
                                        error={errors.email}
                                        touched={touched.email}
                                        onKeyDown={restrictEmailChars}
                                    />

                                </div>
                                <div className="col-lg-6 col-md-12">

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
                                <div className="col-lg-6 col-md-12">

                                    <FormField
                                        name="country"
                                        label="Country*"
                                        error={errors.country}
                                        touched={touched.country}
                                        onKeyDown={restrictSpecialChar}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <FormField
                                        name="city"
                                        label="City*"
                                        error={errors.city}
                                        touched={touched.city}
                                        onKeyDown={restrictSpecialChar}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <FormSelect
                                        name="inquiry_Type"
                                        label="What can we help you with?*"
                                        placeholder="Select Inquiry Type"
                                        options={inquiryOptions.map(type => ({
                                            label: type.charAt(0).toUpperCase() + type.slice(1),
                                            value: type
                                        }))}
                                        error={errors.inquiry_Type}
                                        touched={touched.inquiry_Type}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <FormSelect
                                        name="subject"
                                        label="Subject*"
                                        placeholder="Select Subject"
                                        options={[
                                            { label: 'General Inquiry', value: 'general' },
                                            { label: 'Technical Support', value: 'tech' },
                                            { label: 'Sales Question', value: 'sales' },
                                        ]}
                                        error={errors.subject}
                                        touched={touched.subject}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <FormDatePicker
                                        name="preferred_date"
                                        label="Preferred Date*"
                                        placeholder="Select Preferred Date"
                                        error={errors.preferred_date}
                                        touched={touched.preferred_date}
                                    />
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <FormField
                                        name="message"
                                        label="Message*"
                                        type="textarea"
                                        error={errors.message}
                                        touched={touched.message}
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
                                            name="captcha"
                                            label="Enter CAPTCHA"

                                            error={errors.captcha}
                                            touched={touched.captcha}
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
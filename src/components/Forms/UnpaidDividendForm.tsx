'use client';
import React, { FC, useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import FormField from './FormField';
import { restrictDigits, restrictSpecialChar, handleCopyPaste } from './FormFunc';
import { Captcha } from '../Captcha';
import { UnpaidDividendFormSchema } from './formschema';

interface FormValues {
    dpid: string;
    clientId: string;
    folioNo: string;
    pan: string;
    user_captcha_input: string;
}

const UnpaidDividendForm: FC = () => {
    const [actualCaptcha, setActualCaptcha] = useState<string>('');
    const [reloadCaptcha, setReloadCaptcha] = useState<boolean>(false);
    const [captchaKey, setCaptchaKey] = useState<number>(0);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (reloadCaptcha) {
            setCaptchaKey((prev) => prev + 1);
        }
    }, [reloadCaptcha]);

    const initialValues: FormValues = {
        dpid: "",
        clientId: "",
        folioNo: "",
        pan: "",
        user_captcha_input: "",
    };

    const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
        // Validate captcha manually
        if (values.user_captcha_input !== actualCaptcha) {
            helpers.setFieldError("user_captcha_input", "Security Code does not match");
            helpers.setSubmitting(false);
            return;
        }

        const finalValues = {
            ...values,
            dpid: values.dpid ? `IN${values.dpid}` : "",
        };

        try {
            // Mocking successful lookup
            // setSubmissionMessage("Data fetched successfully! (Simulation)");
            console.log("Submitting values: ", finalValues);
        } catch (error) {
            console.error(error);
            // setSubmissionMessage("Failed to fetch dividend data. Please try again.");
        } finally {
            helpers.setSubmitting(false);
            setReloadCaptcha(prev => !prev);
        }
    };

    return (
        <div className="unpaid_dividend_form_wrapper form_container c-form">
            <div className="dividend_form_card">
                <Formik
                    initialValues={initialValues}
                    validationSchema={UnpaidDividendFormSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, resetForm, setFieldValue, values }) => {
                        const handleResetClick = () => {
                            resetForm();
                            setReloadCaptcha(prev => !prev);
                        };

                        return (
                            <Form noValidate>
                                <div className="row align-items-start">
                                    {/* DPID */}
                                    <div className="col-md-6 col-12">
                                        <FormField
                                            name="dpid"
                                            label="DPID"
                                            showLabel={true}
                                            prefixText="IN"
                                            error={errors.dpid}
                                            touched={touched.dpid}
                                            maxLength={6}
                                            onKeyDown={restrictDigits}
                                            onPaste={handleCopyPaste}
                                            disabled={!!values.folioNo}
                                        />
                                    </div>

                                    {/* Client ID */}
                                    <div className="col-md-6 col-12">
                                        <FormField
                                            name="clientId"
                                            label="Client ID"
                                            showLabel={true}
                                            error={errors.clientId}
                                            touched={touched.clientId}
                                            maxLength={8}
                                            onKeyDown={restrictDigits}
                                            onPaste={handleCopyPaste}
                                            disabled={!!values.folioNo}
                                        />
                                    </div>

                                    {/* OR Separator */}
                                    <div className="col-12 my-3 text-center or_divider">
                                        <div className="or_divider_line"></div>
                                        <span className="or_divider_text">OR</span>
                                        <div className="or_divider_line"></div>
                                    </div>

                                    {/* Folio No */}
                                    <div className="col-md-12 col-12">
                                        <FormField
                                            name="folioNo"
                                            label="Folio No"
                                            showLabel={true}
                                            error={errors.folioNo}
                                            touched={touched.folioNo}
                                            onKeyDown={restrictSpecialChar}
                                            disabled={!!values.dpid || !!values.clientId}
                                        />
                                    </div>

                                    {/* PAN */}
                                    <div className="col-md-12 col-12">
                                        <FormField
                                            name="pan"
                                            label="PAN"
                                            showLabel={true}
                                            error={errors.pan}
                                            touched={touched.pan}
                                            maxLength={10}
                                            onKeyDown={restrictSpecialChar}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue("pan", e.target.value.toUpperCase());
                                            }}
                                        />
                                    </div>

                                    {/* Captcha & Security Code */}
                                    <div className="col-md-6 col-12">
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

                                    {/* Submit Buttons */}
                                    <div className="col-12 mt-4 d-flex gap-3">
                                        <button
                                            type="submit"
                                            className="form_submit_button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Fetching...' : 'Get Data'}
                                        </button>
                                        <button
                                            type="button"
                                            className="form_submit_button reset_btn"
                                            onClick={handleResetClick}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default UnpaidDividendForm;

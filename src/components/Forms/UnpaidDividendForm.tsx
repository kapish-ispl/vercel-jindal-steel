'use client';
import React, { FC, useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import FormField from './FormField';
import { restrictDigits, restrictSpecialChar, handleCopyPaste } from './FormFunc';
import { Captcha } from '../Captcha';
import { UnpaidDividendFormSchema } from './formschema';
import { serverRequest } from '@/services/getServerSideRender';
import { CONSTANTS } from '@/config/constant';
import { UNPAID_DIVIDEND_ENDPOINT } from '@/config/apiConfig';
import { toast } from 'react-hot-toast';

interface FormValues {
    dpid: string;
    clientId: string;
    folioNo: string;
    pan: string;
    user_captcha_input: string;
}

const formatAmount = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return String(val);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(num);
};

const UnpaidDividendForm: FC = () => {
    const [actualCaptcha, setActualCaptcha] = useState<string>('');
    const [reloadCaptcha, setReloadCaptcha] = useState<boolean>(false);
    const [captchaKey, setCaptchaKey] = useState<number>(0);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [results, setResults] = useState<any[] | null>(null);
    const [submissionError, setSubmissionError] = useState<boolean>(false);

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
        // Reset previous state
        setResults(null);
        setSubmissionError(false);

        // Validate captcha manually
        if (values.user_captcha_input !== actualCaptcha) {
            helpers.setFieldError("user_captcha_input", "Security Code does not match");
            helpers.setSubmitting(false);
            return;
        }

        // Construct query parameters
        const params = new URLSearchParams();
        params.append("pan_no", values.pan);

        if (values.folioNo) {
            params.append("folio_no", values.folioNo);
        } else {
            params.append("dp_id", `IN${values.dpid}`);
            params.append("client_id", values.clientId);
        }

        const url = `${UNPAID_DIVIDEND_ENDPOINT}?${params.toString()}`;

        try {
            console.log("Submitting values to: ", url);
            const response = await serverRequest(null, url, CONSTANTS.REQUEST_GET);

            if (response && response.code === "SUC200") {
                const data = response.data;
                const records = Array.isArray(data) ? data : data ? [data] : [];

                if (records.length > 0) {
                    setResults(records);
                    toast.success("Unpaid dividend details retrieved successfully.");
                } else {
                    toast.error("No unpaid dividend records found for the entered details.");
                }
            } else {
                setSubmissionError(true);
                toast.error(response?.message || "Failed to fetch dividend data. Please try again.");
            }
        } catch (error) {
            setSubmissionError(true);
            toast.error(`${error}, Failed to fetch dividend data. Please try again.`);
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
                            setResults(null);
                            setSubmissionError(false);
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

                {results && results.length > 0 && (
                    <div className="table-responsive mt-4 unpaid-dividend-results">
                        <table className="table table-bordered table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>Sr No.</th>
                                    <th>Name</th>
                                    <th>PAN No.</th>
                                    <th>Folio No.</th>
                                    <th>DP ID - Client ID</th>
                                    <th>Unpaid Dividend Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results && results.length > 0 ? results.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{row.name || '-'}</td>
                                        <td>{row.pan_no || '-'}</td>
                                        <td>{row.folio_no || '-'}</td>
                                        <td>{row.dp_id ? row.dp_id + '-' + row.client_id : '-'}</td>
                                        <td className="text-end font-monospace fw-semibold">
                                            {row.amount ? formatAmount(row.amount) : '-'}
                                        </td>
                                    </tr>
                                )) : <tr>
                                    <td colSpan={6} className="text-center">No results found</td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnpaidDividendForm;

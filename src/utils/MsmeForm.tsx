import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRef, useContext, useState, useEffect } from "react";
import { POST_MSME_ENDPOINT } from "@/config/apiConfig";
// import { postAPIMsmeResponse } from "@/services/apiRequests";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
// import Loading from "@/components/Loading";
import {
    handleCopyPaste,
    restrictEmailChars,
    validateMobile,
    validateNumberLength,
} from "@/config/globalFunc";

const MsmeForm = ({ data }: any) => {
    const contextInfo = useContext(AppContext);
    const router = useRouter();
    const [alertMsg, setAlertMsg] = useState("");
    const [submitMsg, setSubmitMsg] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const mobileRef = useRef<any>(null);
    const pincodeRef = useRef<any>(null);

    const initialValues = {
        gst_number: "",
        email: "",
        mobile: "",
        name_of_the_firm: "",
        address_of_the_firm: "",
        pincode: "",
        contact_person_name: "",

        products: {
            HR_coil: false,
            Plates: false,
            CRFH_coil: false,
            TMT: false,
            wire_rods: false,
            HRPO_coils: false,
            HRSPO_coils: false,
            rails: false,
            structures: false,
            hollow_section: false,
            cement: false,

            ///fileds
            HR_coil_quantity: "",
            Plates_quantity: "",
            CRFH_coil_quantity: "",
            TMT_quantity: "",
            wire_rods_quantity: "",
            HRPO_coils_quantity: "",
            HRSPO_quantity: "",
            rails_quantity: "",
            structures_quantity: "",
            hollow_section_quantity: "",
            cement_quantity: "",
        },
    };
    const productsShape: Record<string, any> = {}

    const productList = [
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

    productList.forEach(({ key, label }) => {
        productsShape[key] = Yup.boolean();

        productsShape[`${key}_quantity`] = Yup.number()
            .typeError('Quantity must be a number')
            .min(0, 'Quantity cannot be negative')
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

    const MsmeFormSchema = Yup.object({
        gst_number: Yup.string()
            .trim()
            .required("GST Number is required")
            .length(15, "GST Number must be exactly 15 characters")
            .matches(
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                "Invalid GST Number format"
            ),
        email: Yup.string().email("Invalid email").required("Email is required"),
        mobile: Yup.string()
            .matches(/^\d{10}$/, "Mobile number must be 10 digits")
            .required("Mobile number is required"),
        name_of_the_firm: Yup.string().trim().required("Name of the Firm is required"),
        address_of_the_firm: Yup.string().trim().required("Address of the Firm is required"),
        pincode: Yup.string().trim()
            .length(6, "Pincode must be exactly 6 digits")
            .matches(/^\d{6}$/, "Pincode must contain only digits")
            .required("Pincode is required"),
        contact_person_name: Yup.string()
            .trim()
            .required("Contact person name is required")
            .matches(/^[^0-9]+$/, "Contact Person Name cannot contain numbers"),

        products: Yup.object()
            .shape(productsShape)
            .test(
                'at-least-one-selected',
                'Please select at least one product',
                (obj) => productList.some(({ key }) => obj?.[key])
            ),
    });


    const handleSubmitData = async (data: any) => {
        contextInfo.setIsLoading(true);

        // Extract quantity fields from the products object
        const quantities = Object.entries(data.products)
            .filter(([key, value]) =>
                key.endsWith("_quantity") &&
                value !== "" &&
                value !== null &&
                value !== undefined
            )
            .reduce((acc: any, [key, value]: any) => {
                acc[key] = value;
                return acc;
            }, {});

        // Combine all form fields into one object
        const finalResponse = {
            gst_number: data.gst_number,
            email: data.email,
            mobile: data.mobile,
            name_of_the_firm: data.name_of_the_firm,
            address_of_the_firm: data.address_of_the_firm,
            pincode: data.pincode,
            contact_person_name: data.contact_person_name,
            ...quantities,
        };

        const formData = new FormData();

        // Static fields
        formData.append("WidgetForm[network_id]", "37");
        formData.append("WidgetForm[widget_id]", "330");

        // Text input fields
        const fieldKeys = [
            "gst_number",
            "email",
            "mobile",
            "name_of_the_firm",
            "address_of_the_firm",
            "pincode",
            "contact_person_name",
        ];

        fieldKeys.forEach((key) => {
            if (finalResponse[key]) {
                formData.append(`WidgetForm[fields][${key}]`, finalResponse[key]);
            }
        });

        // Product quantity keys
        const productKeys = [
            "HR_coil_quantity",
            "Plates_quantity",
            "CRFH_coil_quantity",
            "TMT_quantity",
            "wire_rods_quantity",
            "HRPO_coils_quantity",
            "HRSPO_quantity",
            "rails_quantity",
            "structures_quantity",
            "hollow_section_quantity",
            "cement_quantity",
        ];

        productKeys.forEach((key) => {
            if (finalResponse[key]) {
                formData.append(`WidgetForm[fields][${key}]`, finalResponse[key]);
            }
        });


        // try {
        //     const response = await postAPIMsmeResponse(`${POST_MSME_ENDPOINT}`, formData);
        //     if (response.code === "SUC200") {
        //         router.replace("/thanks.html");
        //     } else {
        //         setSubmitSuccess(false);
        //         setSubmitMsg(true);
        //         setAlertMsg(response.message || "Something went wrong, please try again later.");
        //     }
        // } catch (error) {
        //     setSubmitSuccess(false);
        //     setSubmitMsg(true);
        //     setAlertMsg("Submission failed. Please try again.");
        // } finally {
        //     contextInfo.setIsLoading(false);
        // }
    };



    return (
        <div className="container-fluid generic_bottom_spacer noSpace bg-gray2 pt-10 pb-10">
            <div className="row">
                <div className="col-12">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 md:col-12 mx-auto">
                                <Formik
                                    initialValues={initialValues}
                                    enableReinitialize={true}
                                    validationSchema={MsmeFormSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        handleSubmitData(values);
                                        // resetForm();
                                    }}
                                >
                                    {({
                                        values,
                                        touched,
                                        errors,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        setFieldValue,
                                        setFieldTouched,
                                        validateForm,
                                        validateField,
                                        isSubmitting,
                                    }) => {
                                        const handleProductCheckbox = (productName: string) => (e: any) => {
                                            const isChecked = e.target.checked;
                                            setFieldValue(`products.${productName}`, isChecked);

                                            if (!isChecked) {
                                                setFieldValue(`products.${productName}_quantity`, '');
                                                setFieldTouched(`products.${productName}_quantity`, false, false);
                                            }
                                            validateField(`products.${productName}_quantity`);
                                            // validateForm();
                                        };

                                        return (
                                            <Form onSubmit={handleSubmit}>
                                                <div className="msme__form commonSection-md">
                                                    <div className="container cus-container">

                                                        <div className="row form_grider d1">
                                                            {/* GST Number ) */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.gst_number && errors.gst_number
                                                                        ? "hasError"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        GST Number*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="gst_number"
                                                                        name="gst_number"
                                                                        placeholder="GST Number*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.gst_number}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        // onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.gst_number && errors.gst_number ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.gst_number}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Email */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.email && errors.email ? "hasError" : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Email*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="email"
                                                                        name="email"
                                                                        placeholder="Email*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.email}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        maxLength={50}
                                                                        onKeyDown={(e) => restrictEmailChars(e)}
                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.email && errors.email ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.email}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Mobile Number */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.mobile && errors.mobile
                                                                        ? "hasError"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Mobile Number*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="mobile"
                                                                        name="mobile"
                                                                        placeholder="Mobile Number*"
                                                                        maxLength={10}
                                                                        className="form_grider_wrap_field"
                                                                        value={values.mobile}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        onKeyDown={(e: any) =>
                                                                            validateMobile(e, mobileRef)
                                                                        }
                                                                        ref={mobileRef}
                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.mobile && errors.mobile ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.mobile}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Name of the Firm ) */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.name_of_the_firm && errors.name_of_the_firm
                                                                        ? "hasError"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Name of the Firm*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="name_of_the_firm"
                                                                        name="name_of_the_firm"
                                                                        placeholder="Name of the Firm*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.name_of_the_firm}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}

                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.name_of_the_firm && errors.name_of_the_firm ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.name_of_the_firm}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Address of the Firm ) */}
                                                            <div className="col-12">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.address_of_the_firm &&
                                                                        errors.address_of_the_firm
                                                                        ? "hasError"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Address of the Firm*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="address_of_the_firm"
                                                                        name="address_of_the_firm"
                                                                        placeholder="Address of the Firm*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.address_of_the_firm}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}

                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.address_of_the_firm && errors.address_of_the_firm ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.address_of_the_firm}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Pin Code ) */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.pincode && errors.pincode ? "hasError" : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Pin Code*
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        id="pincode"
                                                                        name="pincode"
                                                                        placeholder="Pin Code*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.pincode}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        ref={pincodeRef}
                                                                        onKeyDown={(e: any) => validateNumberLength(e, pincodeRef, 6)}
                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.pincode && errors.pincode ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.pincode}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            {/* Contact Person Name ) */}
                                                            <div className="col-12 col-md-6">
                                                                <div
                                                                    className={`form_grider_wrap ${touched.contact_person_name && errors.contact_person_name
                                                                        ? "hasError"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <label className="form_grider_wrap_label">
                                                                        Contact Person Name*
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="contact_person_name"
                                                                        name="contact_person_name"
                                                                        placeholder="Contact Person Name*"
                                                                        className="form_grider_wrap_field"
                                                                        value={values.contact_person_name}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}

                                                                        onPaste={handleCopyPaste}
                                                                        autoComplete="off"
                                                                    />
                                                                    {touched.contact_person_name && errors.contact_person_name ? (
                                                                        <p className="form_grider_wrap_helper">
                                                                            {errors.contact_person_name}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form_grider_wrap field-email-id required">
                                                                    <label className="form_grider_wrap_label" htmlFor="email-id">
                                                                        Select Product and Quantity <span className="required">*</span>
                                                                    </label>
                                                                </div>
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product</th>
                                                                            <th>Quantity (In MT.)</th>
                                                                        </tr>

                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="HR_coil"
                                                                                            name="products.HR_coil"
                                                                                            onChange={handleProductCheckbox('HR_coil')}
                                                                                            checked={values.products.HR_coil}
                                                                                        />
                                                                                        <label htmlFor="HR_coil">HR coil</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div
                                                                                    className={`form_grider_wrap ${errors.products?.HR_coil_quantity ? "hasError" : ""
                                                                                        }`}
                                                                                >
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.HR_coil_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="HR coil Qty"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.HR_coil_quantity}
                                                                                    />
                                                                                    {errors.products?.HR_coil_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">
                                                                                            {errors.products?.HR_coil_quantity}
                                                                                        </p>
                                                                                    ) : null}
                                                                                </div>

                                                                            </td>
                                                                        </tr>
                                                                        {/* Plates */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="Plates"
                                                                                            name="products.Plates"
                                                                                            onChange={handleProductCheckbox('Plates')}
                                                                                            checked={values.products.Plates}
                                                                                        />
                                                                                        <label htmlFor="Plates">Plates</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.Plates_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.Plates_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Plates Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.Plates_quantity}
                                                                                    />
                                                                                    {errors.products?.Plates_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.Plates_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* CRFH coil */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="CRFH_coil"
                                                                                            name="products.CRFH_coil"
                                                                                            onChange={handleProductCheckbox('CRFH_coil')}
                                                                                            checked={values.products.CRFH_coil}
                                                                                        />
                                                                                        <label htmlFor="CRFH_coil">CRFH coil</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.CRFH_coil_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.CRFH_coil_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="CRFH Coil Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.CRFH_coil_quantity}
                                                                                    />
                                                                                    {errors.products?.CRFH_coil_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.CRFH_coil_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* TMT */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="TMT"
                                                                                            name="products.TMT"
                                                                                            onChange={handleProductCheckbox('TMT')}
                                                                                            checked={values.products.TMT}
                                                                                        />
                                                                                        <label htmlFor="TMT">TMT</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.TMT_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.TMT_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="TMT Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.TMT_quantity}
                                                                                    />
                                                                                    {errors.products?.TMT_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.TMT_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* wire rods */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="wire_rods"
                                                                                            name="products.wire_rods"
                                                                                            onChange={handleProductCheckbox('wire_rods')}
                                                                                            checked={values.products.wire_rods}
                                                                                        />
                                                                                        <label htmlFor="wire_rods">Wire rods</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.wire_rods_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.wire_rods_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Wire rods Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.wire_rods_quantity}
                                                                                    />
                                                                                    {errors.products?.wire_rods_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.wire_rods_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* HRPO coils */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="HRPO_coils"
                                                                                            name="products.HRPO_coils"
                                                                                            onChange={handleProductCheckbox('HRPO_coils')}
                                                                                            checked={values.products.HRPO_coils}
                                                                                        />
                                                                                        <label htmlFor="HRPO_coils">HRPO coils</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.HRPO_coils_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.HRPO_coils_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="HRPO coils Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.HRPO_coils_quantity}
                                                                                    />
                                                                                    {errors.products?.HRPO_coils_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.HRPO_coils_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* HRSPO coils */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="HRSPO_coils"
                                                                                            name="products.HRSPO_coils"
                                                                                            onChange={handleProductCheckbox('HRSPO_coils')}
                                                                                            checked={values.products.HRSPO_coils}
                                                                                        />
                                                                                        <label htmlFor="HRSPO_coils">HRSPO coils</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.HRSPO_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.HRSPO_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="HRSPO coils Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.HRSPO_quantity}
                                                                                    />
                                                                                    {errors.products?.HRSPO_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.HRSPO_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* rails */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="rails"
                                                                                            name="products.rails"
                                                                                            onChange={handleProductCheckbox('rails')}
                                                                                            checked={values.products.rails}
                                                                                        />
                                                                                        <label htmlFor="rails">Rails</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.rails_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.rails_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Rails Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.rails_quantity}
                                                                                    />
                                                                                    {errors.products?.rails_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.rails_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* structures */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="structures"
                                                                                            name="products.structures"
                                                                                            onChange={handleProductCheckbox('structures')}
                                                                                            checked={values.products.structures}
                                                                                        />
                                                                                        <label htmlFor="structures">Structures</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.structures_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.structures_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Structures Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.structures_quantity}
                                                                                    />
                                                                                    {errors.products?.structures_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.structures_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* hollow section */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="hollow_section"
                                                                                            name="products.hollow_section"
                                                                                            onChange={handleProductCheckbox('hollow_section')}
                                                                                            checked={values.products.hollow_section}
                                                                                        />
                                                                                        <label htmlFor="hollow_section">Hollow section</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.hollow_section_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        step="any"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.hollow_section_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Hollow section Qty"
                                                                                        onChange={handleChange}
                                                                                        value={values.products.hollow_section_quantity}
                                                                                    />
                                                                                    {errors.products?.hollow_section_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.hollow_section_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        {/* cement */}
                                                                        <tr>
                                                                            <td valign="middle">
                                                                                <div className="d-flex align-items-center">
                                                                                    <div className="form-group mb-0">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="cement"
                                                                                            name="products.cement"
                                                                                            onChange={handleProductCheckbox('cement')}
                                                                                            checked={values.products.cement}
                                                                                        />
                                                                                        <label htmlFor="cement">Cement</label>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td valign="middle">
                                                                                <div className={`form_grider_wrap ${errors.products?.cement_quantity ? "hasError" : ""}`}>
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form_grider_wrap_field"
                                                                                        name="products.cement_quantity"
                                                                                        autoComplete="off"
                                                                                        placeholder="Cement Qty"
                                                                                        onChange={handleChange}
                                                                                        min="0"
                                                                                        step="any"
                                                                                        value={values.products.cement_quantity}
                                                                                    />
                                                                                    {errors.products?.cement_quantity ? (
                                                                                        <p className="form_grider_wrap_helper">{errors.products.cement_quantity}</p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>


                                                                    </thead>
                                                                </table>
                                                                <div className="form-error text-[#ef4444]">
                                                                    {
                                                                        errors.products &&
                                                                            (typeof errors.products !== 'object' || errors.products === null)
                                                                            ? JSON.stringify(errors.products)
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                                : "Something went wrong please try it later.."}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="button_wrap d-flex justify-content-center">
                                                                    <button
                                                                        type="submit"
                                                                        onClick={() => { validateForm() }}
                                                                        className="cus_btn2"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        <span>SAVE AND SUBMIT</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </Form>
                                        )
                                    }
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MsmeForm;

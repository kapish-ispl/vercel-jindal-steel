"use client";

import { serverRequest } from "@/services/getServerSideRender";
import { useSearchParams, useParams } from "next/navigation";
import { GET_JOB_ENDPOINT, GET_MENU_ENDPOINT, GET_POST_ENDPOINT } from "@/config/apiConfig";
import { ReactNode, createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { CONSTANTS } from "@/config/constant";
import AOS from "aos";

type Option = { label: string; value: string };

type contextType = {
    headerMenu: any[];
    footerMenu: any[];
    footerBottomMenu: any[];
    productData: any[];
    menuType: string;
    isLoading: boolean;
    audioState: boolean;
    routerPage: any;
    routerPageSize: any;
    routerFilter: any;
    routerMedia: any;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setAudioState: Dispatch<SetStateAction<boolean>>;
    setMenuType: Dispatch<SetStateAction<string>>;
    genderOptions: Option[];
    nationalityOptions: Option[];
    degreeOptions: Option[];
    countryOptions: Option[];
    statesOptions: Option[];
    departmentOptions: Option[];
    locationOptions: Option[];
};

export const AppContext = createContext<contextType>({
    headerMenu: [],
    footerMenu: [],
    footerBottomMenu: [],
    productData: [],
    menuType: "",
    isLoading: false,
    audioState: false,
    routerPage: "",
    routerPageSize: "",
    routerFilter: "",
    routerMedia: "",
    setIsLoading: () => { },
    setAudioState: () => { },
    setMenuType: () => { },
    genderOptions: [],
    nationalityOptions: [],
    degreeOptions: [],
    countryOptions: [],
    statesOptions: [],
    departmentOptions: [],
    locationOptions: [],
});

const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const searchParams = useSearchParams();
    const params = useParams();

    const slug = params.slug;
    const routerPage = searchParams.get("page") ?? "1";
    const routerPageSize = searchParams.get("size") ?? "9";
    const routerFilter = searchParams.get("filter") ?? undefined;
    const routerMedia = searchParams.get("media") ?? undefined;

    const [headerMenu, setHeaderMenu] = useState([]);
    const [footerMenu, setFooterMenu] = useState([]);
    const [mastersData, setMastersData] = useState<any>([]);
    const [footerBottomMenu, setFooterBottomMenu] = useState([]);
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioState, setAudioState] = useState(false);
    const [jobPostId, setJobPostId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [jobCode, setJobCode] = useState("");
    const [fontSize, setFontSize] = useState(0);
    const [selectedText, setSelectedText] = useState("");
    const [audioObject, setAudioObject] = useState<any>([]);
    const [menuType, setMenuType] = useState("page");

    // Master data options state
    const [genderOptions, setGenderOptions] = useState<Option[]>([]);
    const [nationalityOptions, setNationalityOptions] = useState<Option[]>([]);
    const [degreeOptions, setDegreeOptions] = useState<Option[]>([]);
    const [countryOptions, setCountryOptions] = useState<Option[]>([]);
    const [statesOptions, setStatesOptions] = useState<Option[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);
    const [locationOptions, setLocationOptions] = useState<Option[]>([]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        const perRequiredRequest = async () => {
            const getHeaderMenu = await serverRequest(
                {},
                `${GET_MENU_ENDPOINT}?slug=header-menu-v2`,
                CONSTANTS.REQUEST_GET
            );
            if (getHeaderMenu && getHeaderMenu.code == CONSTANTS.STATUS_SUCCESS) {
                setHeaderMenu(getHeaderMenu.data);
            } else {
                setHeaderMenu([]);
            }

            const getFooterMenu = await serverRequest({}, `${GET_MENU_ENDPOINT}?slug=footer-menu-v2`, CONSTANTS.REQUEST_GET);
            if (getFooterMenu && getFooterMenu.code == CONSTANTS.STATUS_SUCCESS) {
                setFooterMenu(getFooterMenu.data);
            } else {
                setFooterMenu([]);
            }
            const getProducts = await serverRequest({}, `${GET_POST_ENDPOINT}?slug=product`, CONSTANTS.REQUEST_GET);
            setProductData(getProducts);
        };
        perRequiredRequest();

        const getPostData = async () => {
            const taxonomyInfo = await serverRequest({}, `${GET_JOB_ENDPOINT}`, CONSTANTS.REQUEST_GET);
            if (taxonomyInfo !== undefined) {
                setMastersData(taxonomyInfo);
            }
        };

        getPostData();
    }, []);

    useEffect(() => {
        if (mastersData && mastersData.code == 'SUC200' && mastersData.data) {
            const data = mastersData.data;

            if (data.gender) {
                setGenderOptions(Object.keys(data.gender).map(key => ({
                    value: key,
                    label: data.gender[key]
                })));
            }

            if (data.nationality) {
                setNationalityOptions(Object.keys(data.nationality).map(key => ({
                    value: key,
                    label: data.nationality[key]
                })));
            }

            if (data.degree) {
                setDegreeOptions(Object.keys(data.degree).map(key => ({
                    value: key,
                    label: data.degree[key]
                })));
            }

            if (data.country) {
                setCountryOptions(Object.keys(data.country).map(key => ({
                    value: key,
                    label: data.country[key]
                })));
            }

            if (data.states) {
                setStatesOptions(Object.keys(data.states).map(key => ({
                    value: key,
                    label: data.states[key]
                })));
            }

            if (data.department) {
                setDepartmentOptions(Object.keys(data.department).map(key => ({
                    value: key,
                    label: data.department[key]
                })));
            }

            if (data.location) {
                setLocationOptions(Object.keys(data.location).map(key => ({
                    value: key,
                    label: data.location[key]
                })));
            }
        }
    }, [mastersData]);

    useEffect(() => {
        const links = document.querySelectorAll("a");

        const speakText = (text: any) => {
            const speechSynthesis = window.speechSynthesis;
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            const playVoice = voices.find(voice => voice.name == 'Tessa' || voice.name == 'Google UK English Female');

            if (playVoice) {
                utterance.voice = playVoice;
            }
            speechSynthesis.speak(utterance);
        };

        const initializeSpeechSynthesis = () => {
            window.speechSynthesis.getVoices();
        }
        initializeSpeechSynthesis();

        const handleMouseEnter = (event: any) => {
            if (window.speechSynthesis && audioState) {
                speakText(event.currentTarget.innerText);
            }
        };

        const handleFocus = (event: any) => {
            const label = event.currentTarget.getAttribute("aria-label") || event.currentTarget.innerText;
            if (window.speechSynthesis && audioState) {
                speakText(label);
            }
        };

        const handleTextSelection = () => {
            const selection = window.getSelection();
            if (selection !== null) {
                let text = selection.toString().trim();
                if (text !== "" && text !== selectedText && audioState) {
                    setSelectedText(text);
                    speakText(text);
                }
            }
        };

        const handleRange = (e: any) => {
            const { target } = e;
            const selection = window.getSelection();
            if (target instanceof HTMLElement && audioState) {
                target.classList.contains('form_grider_wrap_field') ? '' : selection?.removeAllRanges();
            }
        };

        const handleTouchEnd = () => {
            const selection = window.getSelection();
            if (selection !== null && selection.toString().trim() !== "" && selection.toString().trim() !== selectedText && audioState) {
                setSelectedText(selection.toString().trim());
                speakText(selection.toString().trim());
            }
        };

        if (document.readyState === "complete" && audioState) {
            links.forEach((a) => {
                a.addEventListener("mouseenter", handleMouseEnter);
                a.addEventListener("focus", handleFocus)
            });
            document.addEventListener("mouseup", handleTextSelection);
            document.addEventListener("click", handleRange);
            document.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            links.forEach((a) => {
                a.removeEventListener("mouseenter", handleMouseEnter);
                a.removeEventListener("focus", handleFocus);
            });
            document.removeEventListener("mouseup", handleTextSelection);
            document.removeEventListener("click", handleRange);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, [audioState, slug, selectedText, audioObject]);

    const values = {
        headerMenu,
        footerMenu,
        fontSize,
        setFontSize,
        footerBottomMenu,
        jobPostId,
        setJobPostId,
        jobCode,
        setJobCode,
        jobTitle,
        jobLocation,
        jobRole,
        setJobTitle,
        setJobLocation,
        setJobRole,
        isLoading,
        setIsLoading,
        productData,
        menuType,
        setMenuType,
        routerPage,
        routerPageSize,
        routerFilter,
        routerMedia,
        audioState,
        setAudioState,
        genderOptions,
        nationalityOptions,
        degreeOptions,
        countryOptions,
        statesOptions,
        departmentOptions,
        locationOptions
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;



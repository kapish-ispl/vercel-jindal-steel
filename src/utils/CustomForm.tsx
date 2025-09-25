import dynamic from "next/dynamic";

interface DynamicComponentProps {
    pageTitle: string;
}

interface CustomFormProps {
    component: string;
    pageTitle: string;
}

const FallbackForm = <><p>Form Does Not Exist</p></>

const CustomForm = ({ component, pageTitle }: CustomFormProps) => {
    const PostComponentRender = dynamic<DynamicComponentProps>(
        () =>
            import(`@/components/Forms/${component}`)
                .then((mod) => mod)
                .catch(() => ({ default: FallbackForm })),
        {
            loading: () => <p>Loading form...</p>,
            ssr: false,
        }
    );

    return <PostComponentRender pageTitle={pageTitle} />;
};

export default CustomForm;

import dynamic from 'next/dynamic';

const CustomProductForm = (props: any) => {
    let PostComponentRender = props.component;
    PostComponentRender = dynamic(() => import(`@/components/Forms/${props.component}`));
    console.log(props);
    return (
        <>
            <PostComponentRender pageTitle={props.title} />
        </>
    )
}
export default CustomProductForm;
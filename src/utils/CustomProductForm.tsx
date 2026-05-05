import dynamic from 'next/dynamic';

const componentMap: any = {
    ProductForm: dynamic(() => import("@/components/Forms/ProductForm")),
}
const CustomProductForm = (props: any) => {
    const PostComponentRender = componentMap[props.components];

    return PostComponentRender ? (
        <PostComponentRender pageTitle={props.title} />
    )
        : <div>Loading...</div>;
}
export default CustomProductForm;
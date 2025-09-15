import { serverRequest } from '@/services/getServerSideRender';
import { GET_SPECIFIC_PAGE_ENDPOINT } from '@/config/apiConfig';
import { CONSTANTS } from '@/config/constant';
import { notFound } from 'next/navigation';
import HomePage from '@/components/template/HomePageTemplate';


export async function generateMetadata(): Promise<any> {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=home`,
    CONSTANTS.REQUEST_GET,
  );

  const pageData = fetchedInfo?.data;
  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: pageData.meta_title,
    description: pageData.meta_description,
  };
}


export default async function Home() {
  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=v2-home`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData) return notFound();

  return <HomePage data={pageData} />;
}

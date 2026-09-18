import { getAdminSnippetData } from "@/app/actions/snippetActions.server";
import AdminSnippetManager from "@/components/snippets/AdminSnippetManager";

export const dynamic = "force-dynamic";

export default async function AdminSnippetsPage() {
  const { products, requests, dataSource } = await getAdminSnippetData();
  return (
    <AdminSnippetManager
      initialProducts={products}
      initialRequests={requests}
      dataSource={dataSource}
    />
  );
}

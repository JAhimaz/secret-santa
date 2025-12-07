import GroupPage from "@/components/pages/GroupPage/GroupPage";

export default async function SelectedGroup({params,
}: {
  params: { id: string };  // not a Promise
}) {
  const { id } = await params;
  
  return <GroupPage groupId={id} />;
}

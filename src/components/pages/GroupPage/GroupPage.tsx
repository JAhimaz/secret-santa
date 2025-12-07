"use client";
import styles from "./GroupPage.module.css";
import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Icon } from "@/components/utils/Icons";
import Button from "@/components/common/Button/Button";
import { Group } from "@/components/types";
import Loader from "@/components/common/Loader/Loader";

export default function GroupPage({ groupId }: { groupId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  useEffect(() => {
  fetch(`/api/groups/${groupId}`)
    .then(res => res.json())
    .then(({ group }) => {
      console.log(group);
      setGroup(group);
      setIsLoading(false);
    })
  }, []);

  if(!user) {
    return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>You must be logged in to view this group.</div>;
  }
  
  if (isLoading) {
    return <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Loader dark />
    </div>;
  }

  const HandleGenerateInviteLink = () => {
    // /groups/{groupId}/generate-invite
    // then update group state with new invite link, it only returns the invitation link
    // so it shows up in the UI

    fetch(`/api/groups/${groupId}/generate-invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
    .then(res => res.json())
    //  return Response.json({ invite_link: updatedGroup?.group_invite });  
    .then(({ invite_link }) => {
      setGroup(prevGroup => prevGroup ? { ...prevGroup, group_invite: invite_link } : prevGroup);
    })
  }

  return (
    <section id="group-page" className={styles.groupContainer}>
      <div className={styles.groupNameContainer}>
        <span className={styles.groupName}>{group?.group_name}</span>
        <span className={styles.groupSubheader}>by {
          group?.memberDetails[group.group_creator]?.name ||
          group?.memberDetails[group.group_creator]?.email ||
          "Unknown"
        }</span>
      </div>
      { user.id === group?.group_creator &&
        <div id="group-top-bar" className={styles.groupTopBar}>
          { group?.group_invite &&
            <div className={styles.inviteLinkDisplay}>
              <span className={styles.inviteLinkLabel}>Invite Link:</span>
              <div className={styles.inviteLinkContainer}>
                {/* create a full URL, url/groups/<groupId>/invite */}
                {`${window.location.origin}/groups/${group.group_id}/invite/${group.group_invite}`}
              </div>
              <Button onClick={() => {
                // copy to clipboard
                navigator.clipboard.writeText(`${window.location.origin}/groups/${group.group_id}/invite/${group.group_invite}`);
                alert("Invite link copied to clipboard!");
              }}>
                <Icon icon="copy" />
              </Button>
            </div>
          }
          { !group?.group_invite && (
            <Button onClick={HandleGenerateInviteLink}>
              <Icon icon="invite" /> Generate Invite Link
            </Button>
          )}
        </div>
      }
      <section id="group-middle-section" className={styles.groupMiddleSection}>
        <div id="group-selected-person"></div>
        <div id="group-management"></div>
      </section>
      <pre>
        {JSON.stringify(group, null, 2)}
      </pre>
    </section>
  )
}
"use client";
import styles from "./NewGroupPage.module.css";
import { useState } from "react";
import { Icon } from "@/components/utils/Icons";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import { group } from "console";
import { redirect } from "next/navigation";

export default function NewGroupPage() {
  const [groupDetails, setGroupDetails] = useState({
    group_name: "",
    group_passkey: "",
    group_cutoff: "",
    members_max: 4,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const HandleCreateGroup = () => {
    console.log("Creating group with details:", groupDetails);

    // Frontend Checks
    if (!groupDetails.group_name || groupDetails.group_name.trim() === "" || groupDetails.group_name.length < 4 || groupDetails.group_name.length > 32) {
      setErrorMessage("Group name must be between 4 and 32 characters.");
      return;
    }

    if (!groupDetails.group_passkey || groupDetails.group_passkey.trim() === "" || groupDetails.group_passkey.length < 3 || groupDetails.group_passkey.length > 12) {
      setErrorMessage("Group passkey must be between 3 and 12 characters.");
      return;
    }

    // Call API to create group
    fetch("/api/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupDetails),
    })
    .then((res) => res.json())
    .then(({ group, error }) => {
      if (error) {
        setErrorMessage(error.message || "Failed to create group.");
        return;
      }

      console.log("Group created successfully:", group);
      redirect(`/groups`);
    })
    .catch((err) => {
      setErrorMessage("An unexpected error occurred.");
      console.error(err);
    });
  };

  return (
    <section className={styles.newGroupPageContainer}>
      <span className={styles.pageTitle}>Create a New Secret Santa Group</span>
      <section className={styles.formSection}>
      <Input
        type="text"
        label="Group Name"
        placeholder="Enter group name"
        value={groupDetails.group_name}
        onChange={(e) =>
          setGroupDetails({ ...groupDetails, group_name: e.target.value })
        }
      />

      <Input
        type="text"
        label="Group Passkey"
        placeholder="Enter group passkey"
        value={groupDetails.group_passkey}
        onChange={(e) =>
          setGroupDetails({ ...groupDetails, group_passkey: e.target.value })
        }
      />

      <Input
        type="date"
        label="Cutoff Date"
        placeholder="Select cutoff date"
        value={groupDetails.group_cutoff}
        onChange={(e) =>
          setGroupDetails({ ...groupDetails, group_cutoff: e.target.value })
        }
      />

      <Input
        type="number"
        minNumber={2}
        maxNumber={30}
        label="Maximum Members"
        placeholder="Enter maximum members"
        value={groupDetails.members_max.toString()}
        onChange={(e) =>
          setGroupDetails({
            ...groupDetails,
            members_max: parseInt(e.target.value) || 0,
          })
        }
      />

      <Button
        width="100%"
        disabled={
          !groupDetails.group_name || !groupDetails.group_passkey || groupDetails.members_max < 2
        }
        onClick={() => {
          HandleCreateGroup();
        }}
      >
        Create Group
      </Button>
      </section>
    </section>
  )
}
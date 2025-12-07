"use client";
import styles from "./GroupsPage.module.css";
import { useEffect, useState } from "react";
import { Icon } from "@/components/utils/Icons";
import { Group } from "@/components/types";
import Link from "next/link";
import Button from "@/components/common/Button/Button";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/client";
import Loader from "@/components/common/Loader/Loader";

export default function GroupsPage() {

  const [groups, setGroups] = useState<Group[]>([])
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });
  }, []);

  useEffect(() => {
    fetch("/api/groups")
      .then(res => res.json())
      .then(({ groups }) => {
        console.log(groups);
        setGroups(groups)
        setIsLoading(false);
      })
  }, []);

  const CreateGroup = async () => {
    fetch("/api/groups/create", {
      method: "POST",
    }).then(res => res.json())
      .then(({ group }) => {
        setGroups(prev => [...prev, group]);
      });
  }

  return (
    <div className={styles.groupsPageContainer}>
      <Button link="/groups/new" width="fit-content" style={{
        marginLeft: "auto",
      }}>
        <Icon icon="plus" /> New Group
      </Button>

      { isLoading && 
        <div style={{ width: "100%", textAlign: "center"}}>
          <Loader size={32} dark /> 
        </div>
      }

      {!isLoading && groups.length === 0 &&
        <span style={{
          fontSize: "0.875rem",
          color: "var(--text-alt)",
        }}>No groups available. Create a new group to get started!</span>
      }

      {!isLoading && groups.length > 0 &&
      <section className={styles.groupsList}>
        {groups.map((group) => (
          <Link href={`/groups/${group.group_id}`} key={group.group_id} className={styles.groupCard}>
            <div className={styles.groupCardSplit}>
              <span className={styles.groupName}>{group.group_name}</span>
              { group.group_creator === user?.id &&
                <Icon icon="crown" title="Group Creator" style={{
                  color: "var(--highlight)"
                }} />
              }
            </div>
            <div className={styles.groupCardSplit} style={{
              marginTop: "auto",
            }}>
              <span className={styles.groupTimeLeft}>{
                // Check if there is a cutoff date
                group.group_cutoff ?
                  // Calculate time left until cutoff date
                  (() => {
                    const cutoffDate = new Date(group.group_cutoff);
                    const now = new Date();
                    const diff = cutoffDate.getTime() - now.getTime();
                    if (diff <= 0) return "Cutoff passed";
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    return `${days}d ${hours}h ${minutes}m left`;
                  })()
                  :
                  "No time limit"
              }</span>
              <span className={styles.groupMembers}>{group.members_curr_count} / {group.members_max}</span>
            </div>
          </Link>
        ))}
      </section>
      }
    </div>
  )
}
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import Section from '../../components/Section/Section';

import FollowersList from './components/FollowersList';
import FollowersListChanges from './components/FollowersListChanges';

import { useBaseStore } from '../../stores';
import { FollowersDiff } from '../../types';

import s from './Followers.module.css';

const Followers = () => {
  const {
    main: { username, token },
    followers: {
      followers,
      loading,
      saving,
      getUserFollowersList,
      saveFollowersList,
      cleanFollowersList,
      getFollowersListDiff,
    },
  } = useBaseStore();

  const [targetUsername, setTargetUsername] = useState<string>(username);
  const [followersDiff, setFollowersDiff] = useState<FollowersDiff | null>(null);

  useEffect(() => {
    setTargetUsername(username);
  }, [username]);

  useEffect(() => {
    cleanFollowersList();
  }, [targetUsername]);

  useEffect(() => {
    if (!saving) {
      (async () => setFollowersDiff(await getFollowersListDiff(targetUsername)))();
    }
  }, [followers, targetUsername, saving]);

  return (
    <>
      <Section title="whose followers to load">
        <label htmlFor="user[target]">User whose followers will be loaded:</label>
        <input
          id="user[target]"
          type="text"
          value={targetUsername}
          placeholder="ex.: rpolonsky"
          onChange={e => setTargetUsername(e.target.value)}
          onKeyUp={e => {
            if (e.keyCode === 13) {
              getUserFollowersList(targetUsername, username, token);
            }
          }}
        ></input>
        <div className={s.row}>
          <button
            onClick={() => {
              getUserFollowersList(targetUsername, username, token);
            }}
            disabled={loading || !targetUsername.length}
          >
            Load followers
          </button>
          <button
            disabled={!followers.length || loading || !targetUsername.length}
            onClick={() => saveFollowersList(targetUsername)}
          >
            {saving ? 'Saving followers...' : 'Save followers snapshot'}
          </button>
        </div>
      </Section>

      {!!followers.length && !loading && !saving && (
        <FollowersListChanges followersDiff={followersDiff} targetUsername={targetUsername} />
      )}

      <FollowersList followers={followers} loading={loading} />
    </>
  );
};

export default observer(Followers);
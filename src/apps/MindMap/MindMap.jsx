import React from 'react';

export function MindMap() {
  return (
    <div>
      <Tabs />
      <Actions />
      <MainView />
    </div>
  );
}

function Tabs() {
  return <div aria-label="tabs"></div>;
}

function Actions() {
  return <div aria-label="actions"></div>;
}

function MainView() {
  return <div aria-label="main view"></div>;
}

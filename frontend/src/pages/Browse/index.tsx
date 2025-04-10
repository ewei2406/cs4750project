import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { Puzzle } from '@/util/types';
import { useGet } from '@/hooks/useGet';
import Navbar from '@/components/Navbar';
import { PUZZLE_TYPE_COLORS } from '@/util/constants';
import PuzzleTable from '@/components/PuzzleTable';

const BrowseConnections = () => {
  const { result } = useGet<Puzzle[]>({
    path: "puzzles/recent"
  })

  if (result.status === "loading") {
    return <div>Loading puzzles...</div>
  }

  if (result.status === "error") {
    return <div>Failed to load puzzles! {result.detail}</div>
  }

  return (
    <div className="connections-page">
      <h1 className="page-heading">Connect With A Game</h1>
      <h3 className="page-subtext">Fresh challenges made by fellow players.</h3>

      <PuzzleTable puzzles={result.data} />
    </div>
  );
};

export default BrowseConnections;


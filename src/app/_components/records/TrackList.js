function TrackList({ tracks }) {
  return (
    <div className="dark:text-accent-100 mt-4">
      <p className="text-xl">Track List</p>
      <ul>
        {tracks.map((track) => (
          <li key={track.number}>
            {track.number} - {track.title} Length: {track.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;

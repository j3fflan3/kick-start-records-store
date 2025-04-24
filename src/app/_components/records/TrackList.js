function TrackList({ tracks }) {
  return (
    <div className="mt-4">
      <p className="text-lg dark:text-primary-400">Track List</p>
      <ul>
        {tracks.map((track) => (
          <li key={track.number} className="text-sm dark:text-primary-500">
            {track.number} - {track.title}
            {/* Length: {track.length} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrackList;

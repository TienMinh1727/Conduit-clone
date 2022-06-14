import React, { memo } from 'react';

function TagsList({ tags }) {
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li className="tag-default tag-pill tag-outline" key={tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default memo(TagsList);

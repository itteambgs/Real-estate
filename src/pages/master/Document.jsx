import React, { useEffect } from 'react';
import { getdocument } from 'helpers/apiHelper';

function Document() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await getdocument();
      console.log("Document API response:", data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>document</h1>
    </div>
  );
}

export default Document;

const apiUrl = process.env.API_URL;
export async function getUserFragments(user, expand=0) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=${expand}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
    return { data };
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

export async function getFragmentById(user, id, ext='') {
  console.log(`Requesting user fragment data by id ${id}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}${ext}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    console.log('Got fragments data with given id', res);
    console.log('res content type', res.headers.get('content-type'));
    const contentType = res.headers.get('content-type');
    if (contentType.startsWith('text/')) {
      try {
        return { contentType, data: await res.text() };
      } catch (e) {
        console.error('cannot return text fragment', { e });
      }
    } else if (contentType.startsWith('application/json')) {
      try {
        return { contentType, data: await res.json() };
      } catch (e) {
        console.error('cannot return json fragment', { e });
      }      
    } else if (contentType.startsWith('image/')) {
      try {
        const myBlob = await res.blob();
        return { contentType, data: myBlob };
      } catch (e) {
        console.error('cannot return image blob', { e });
      } 
    }
  } catch (err) {
    console.error('Unable to call GET /v1/fragments/:id', { err });
    throw new Error(err);
  }
}
export async function getFragmentByIdInfo(user, id) {
  console.log(`Requesting user fragment metadata by id ${id}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    const data = await res.json();
    console.log('Got fragment metadata', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragments/:id', { err });
    throw new Error(err);
  }
}

export async function postFragment(user, value, contentType) {
  console.log('Post fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': contentType,
      },
      body: value,
    });
    if (!res.ok) {
      const error = await res.json();
      throw error.error?.message || res.statusText;
    }
    const data = await res.json();
    console.log('Posted fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
    throw new Error(err);
  }
}

export async function deleteFragment(user, id) {
  console.log('Delete fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Deleted fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragments', { err });
  }
}

export async function updateFragment(user, value, id, contentType) {
  console.log('Update fragment data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': contentType,
      },
      body: value,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Updated fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call PUT /v1/fragments', { err });
  }
}
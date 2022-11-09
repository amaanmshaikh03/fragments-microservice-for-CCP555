import { Auth, getUser } from './auth';
import { getUserFragments, getFragmentById, getFragmentByIdInfo, postFragment, updateFragment, deleteFragment } from './api';
async function init() {
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  loginBtn.onclick = () => {
    Auth.federatedSignIn();
  };

  logoutBtn.onclick = () => {
    Auth.signOut();
  };
  const user = await getUser();
  if (!user) {
    logoutBtn.disabled = true;
    return;
  }
  console.log({ user });
  await getUserFragments(user, 1);
  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;  
  loginBtn.disabled = true;
  const current = document.querySelector('#current');
  const selectTypeSection = document.querySelector('#type');
  const fileImportSection = document.querySelector('#fileImport');
  const convertTypeFormSection = document.querySelector('#convertType');
  const metadataSection = document.querySelector('#metadataSection');
  const convertTypeForm = document.getElementById('convertTypeForm');
  const img = document.getElementById('imageFragment');
  const deleteBtn = document.getElementById('deleteBtn');
  const fragmentToDisplay = document.getElementById('fragment');
  const metadataToDisplay = document.getElementById('metadata');
  let selectedFeature = 'create';
  let selectedFragment = {};
  let selectedType = 'text/plain';
  document.getElementById('features').addEventListener('change', async function(e) {
    e.preventDefault();
    selectedFeature = e.target.value;
    console.log('selected feature: ' + selectedFeature);
    img.src = '';   
    fragmentToDisplay.innerHTML = '';
    metadataToDisplay.innerText = '';
    metadataSection.style.display = 'none';

    if (selectedFeature === 'view') {
      convertTypeFormSection.style.display = 'inline-block';
    } else {
      convertTypeFormSection.style.display = 'none';
    }

    if (selectedFeature === 'delete') {
      deleteBtn.style.display = 'inline-block';
    } else {
      deleteBtn.style.display = 'none';
    }
    if (selectedFeature !== 'create') {
      const fragments = await getUserFragments(user, 1);
      document.getElementById('existingFragmentsLbl').innerText = `Choose a fragment to ${selectedFeature}`;
      removeFragmentsOptions();
      await fillFragmentsOptions(fragments.data.fragments);
      current.style.display='inline-block';
      selectTypeSection.style.display='none';
      if (selectedFeature === 'update') {
        fileImportSection.style.display='block';
      } else {
        fileImportSection.style.display='none';
      }
    } else {
      existingFragmentsSection.style.display='none';
      selectTypeSection.style.display='block';
      fileImportSection.style.display='block';
    }
    
  });

  deleteBtn.onclick = async () => {
    try {
      const deleted = await deleteFragment(user, selectedFragment.id);
      if (deleted.status === 'ok') {
        fragmentToDisplay.innerHTML = `Fragment with id: ${selectedFragment.id} has been successfully deleted.`;
      }
      
    } catch (e) {
      console.log(e);
    }
  }

  function fillFragmentsOptions(fragments) {
    fragments.sort(function(a,b){
      return new Date(b.updated) - new Date(a.updated);
    });

    const select = document.getElementById('existingFragments');
    
    for (let i=0; i<fragments.length; i++) {
      const option = new Option();
      option.value = JSON.stringify({id: fragments[i].id, type: fragments[i].type});
      option.text = `${fragments[i].id}, ${fragments[i].type}`;
      select.appendChild(option);
    }
  }

  function removeFragmentsOptions() {
    const select = document.getElementById('existingFragments');
    while (select.lastChild.id !== 'default') {
      select.removeChild(select.lastChild);
    }
  }
  
  document.getElementById('existingFragments').addEventListener('change', function(e) {
    e.preventDefault();
    if (e.target.value === 'Select a fragment') {
      fragmentToDisplay.innerHTML = 'Please select a fragment';
    } else {
      selectedFragment = JSON.parse(e.target.value);
      const selectedFragmentId = selectedFragment.id;
      selectedType = selectedFragment.type;
      console.log('selected fragment: ' + selectedFragmentId);
    }
  });
  document.getElementById('types').addEventListener('change', function(e) {
    e.preventDefault();
    selectedType = e.target.value;
    console.log('selected type: ' + selectedType);
  });

  async function displayFragment(id, selectedConversionType) {
    try {
      while (fragmentToDisplay.firstChild) {
        fragmentToDisplay.removeChild(fragmentToDisplay.firstChild);
      }
      fragmentToDisplay.innerText = '';
      img.src = '';
      const { contentType, data } = await getFragmentById(user, id, selectedConversionType);
      const metadata = await getFragmentByIdInfo(user, id);
      if (metadata) {
        metadataSection.style.display = 'block';
        metadataToDisplay.innerHTML = JSON.stringify(metadata);
      }
      if (contentType.startsWith('image/')) {
        img.src = URL.createObjectURL(data);  
      } else if (contentType.startsWith('text/html')) {
        fragmentToDisplay.insertAdjacentHTML('afterbegin',data);
      } else {
        fragmentToDisplay.innerText = typeof data === 'object' ? JSON.stringify(data) : data;
      }
    } catch (e) {
      console.error('Get by id failed after post through file: ', { e });
      fragmentToDisplay.innerText = e;
      metadataSection.style.display = 'none';
    }
  }

  convertTypeForm.addEventListener('submit', (e) => handleConvertTypeForm(e));
  async function handleConvertTypeForm(e, id) {
    e.preventDefault();
    fragmentToDisplay.innerText = '';
    const selectedConversionType = document.getElementById('convertTypes').value;
    let fragmentId;
    if (selectedFeature === 'view') {
      fragmentId = selectedFragment.id;
    } else {
      fragmentId = id;
    }
    console.log('selected feature:' + selectedFeature);
    console.log('id:' + fragmentId);
    console.log('selected conversion extension: ' + document.getElementById('convertTypes').value);
    displayFragment(fragmentId, selectedConversionType);
  }
  const inputEl = document.getElementById('inputFile');
  inputEl?.addEventListener('change', handleFile);
  function handleFile(evt) {
    const files = evt.target.files; 
    const f = files[0];
    const reader = new FileReader();    
    fragmentToDisplay.innerText = '';
    reader.onload = (function() {
      return async function(e) {
        console.log('uploaded file type: ' + f.type);
        if (selectedType && selectedType !== f.type) {
          alert('Uploaded file type must be same as selected type.');
        } else {
          console.log('selected feature: ' + selectedFeature);

          let fragment;

          try {
            if (selectedFeature === 'create') {
              fragment = await postFragment(user, e.target.result, f.type);
            } else {
              fragment = await updateFragment(user, e.target.result, selectedFragment.id, f.type);
            }
            if (fragment) {
              fragmentToDisplay.innerHTML = `Fragment of type ${fragment.fragment.type} with id: ${fragment.fragment.id} is ${selectedFeature}d!`;
            }
          } catch (e) {
            fragmentToDisplay.innerText = e;
          }
        }
      };
    })(f);
    reader.readAsArrayBuffer(f);
  }
}
addEventListener('DOMContentLoaded', init);
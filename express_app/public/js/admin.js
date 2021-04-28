const deleteProduct = async (btn) => {
  const { productId, csrfToken } = btn.dataset;

  fetch(`/admin/products/${productId}`, {
    method: 'delete',
    credentials: 'same-origin',
    headers: { 'CSRF-Token': csrfToken },
  })
    .then((response) => {
      console.log('response', response);
      if (response.ok) return response.json();
      throw response;
    })
    .then((data) => {
      const node = document.querySelector(`#product_${productId}`);
      node.remove();
    })
    .catch(console.error);
};

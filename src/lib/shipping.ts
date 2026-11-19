/**
 * Frais de livraison, en centimes : À DÉFINIR avec le client (aucun tarif n'a été communiqué).
 * Tant que ce n'est pas renseigné, la livraison est facturée 0 € : ne pas passer en production réelle avant de le fixer.
 */
export const SHIPPING_FEE = 0;
export const FREE_SHIPPING_FROM = 0; // seuil de gratuité en centimes (0 = toujours gratuit tant que non défini)
export const shippingFor = (subtotalAfterDiscount: number) =>
  FREE_SHIPPING_FROM > 0 && subtotalAfterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

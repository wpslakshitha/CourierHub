import query from "../utils/query.js";
export const createShipment = async (data) => {
    const { user_id, sender_name, sender_address, sender_email, sender_state, sender_city, sender_zip, sender_country, sender_phone, recipient_name, recipient_email, recipient_state, recipient_address, recipient_city, recipient_zip, recipient_country, recipient_phone, weight, length, width, height, package_type, special_instructions, estimated_delivery_date, shipping_cost, shipping_method, insurance, signature_required, status, } = data;
    const tracking_number = generateTrackingNumber();
    const sql = `
    INSERT INTO shipments (
    user_id, tracking_number, sender_name, sender_email, sender_state, sender_address, sender_city, sender_zip,
    sender_country, sender_phone, recipient_name, recipient_email,
    recipient_state, recipient_address, recipient_city,
    recipient_zip, recipient_country, recipient_phone, weight, length, width, height,
    package_type,  special_instructions, estimated_delivery_date, shipping_cost, shipping_method,
    insurance,
    signature_required,
    status
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18, $19, $20, $21,
      $22, $23, $24, $25, $26, $27,
      $28, $29, $30
    )
    RETURNING *;
  `;
    const values = [
        user_id,
        tracking_number,
        sender_name,
        sender_email,
        sender_state,
        sender_address,
        sender_city,
        sender_zip,
        sender_country,
        sender_phone,
        recipient_name,
        recipient_email,
        recipient_state,
        recipient_address,
        recipient_city,
        recipient_zip,
        recipient_country,
        recipient_phone,
        weight,
        length,
        width,
        height,
        package_type,
        special_instructions,
        estimated_delivery_date,
        shipping_cost,
        shipping_method,
        insurance,
        signature_required,
        status,
    ];
    const result = await query(sql, values);
    return result.rows[0];
};
const generateTrackingNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CS${year}${uniqueId}`;
};
export const getShipmentsByUser = async (userId) => {
    const sql = `SELECT * FROM shipments WHERE user_id = $1 ORDER BY created_at DESC;`;
    const result = await query(sql, [userId]);
    return result.rows;
};
export const getShipmentByTracking = async (trackingNumber) => {
    const sql = `
    SELECT * FROM shipments 
    WHERE tracking_number = $1 
    LIMIT 1;
  `;
    const result = await query(sql, [trackingNumber]);
    return result.rows[0] || null;
};
export const getAllShipments = async () => {
    const sql = `
    SELECT 
      s.*,
      u.name as user_name,
      u.email as user_email
    FROM shipments s
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC;
  `;
    const result = await query(sql);
    return result.rows;
};
export const updateShipmentStatus = async (shipmentId, status) => {
    const sql = `
    UPDATE shipments 
    SET status = $1, updated_at = NOW()
    WHERE id = $2 
    RETURNING *;
  `;
    const result = await query(sql, [status, shipmentId]);
    return result.rows[0];
};

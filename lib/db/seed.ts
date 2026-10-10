import { getDb } from './index';
import bcrypt from 'bcryptjs';

export function seedDatabase(passedDb?: any) {
  const db = passedDb || getDb();

  // 1. Admin Users
  try {
    const adminCount = (db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number })?.count || 0;
    if (adminCount === 0) {
      const salt = bcrypt.genSaltSync(10);
      const adminPasswordHash = bcrypt.hashSync('admin123', salt);

      const insertAdmin = db.prepare(`
        INSERT OR REPLACE INTO admin_users (id, name, email, password_hash, role, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      insertAdmin.run('usr_super_admin', 'MAA Enterprises Admin', 'admin@maaenterprises.com', adminPasswordHash, 'Super Admin', 'active');
      insertAdmin.run('usr_sales_manager', 'Sales Manager Mahagama', 'sales@maaenterprises.com', adminPasswordHash, 'Sales', 'active');
    }
  } catch (e) {
    console.warn('Error checking admin users:', e);
  }

  // Clear previous entries and re-seed clean Northstar EV models
  try {
    db.exec(`
      DELETE FROM bike_variants;
      DELETE FROM bikes;
      DELETE FROM settings;
    `);
  } catch (e) {
    console.warn('Notice clearing bikes/settings:', e);
  }

  console.log('Seeding MAA Enterprises — Northstar EV database...');

  // 2. Northstar EV Scooter Models & 5 Colour Variants + Turquoise Flagship
  const insertBike = db.prepare(`
    INSERT INTO bikes (id, slug, name, category, tagline, description, engine_cc, max_power, max_torque, fuel_capacity, mileage, curb_weight, image_url, is_featured, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVariant = db.prepare(`
    INSERT INTO bike_variants (id, bike_id, name, ex_showroom_price, color_name, color_hex, image_url, in_stock, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Flagship Northstar EV Scooter Line
  insertBike.run(
    'scooter_northstar',
    'northstar-ev-scooter',
    'Northstar EV Electric Scooter',
    'Electric Scooter',
    'Ride a Cleaner Tomorrow',
    'The flagship Northstar EV electric scooter at MAA Enterprises, Mahagama. Designed for a smarter, cleaner ride with instant electric torque, zero emissions, and premium road comfort. Bajaj Finserv EMI available.',
    'Electric Motor',
    'High-Torque EV Hub',
    'Instant Electric',
    'Battery Pack',
    'Zero Emissions',
    'Lightweight Frame',
    '/scooters/turquoise.jpg',
    1,
    1
  );

  // 6 Colour Variants: Turquoise (Flagship) + 5 Advertised Colours (Pink, Sky Blue, Purple, Dark Blue, Red)
  insertVariant.run('var_turquoise', 'scooter_northstar', 'Northstar EV (Turquoise Edition)', 0, 'Turquoise', '#00F0FF', '/scooters/turquoise.jpg', 1, 1);
  insertVariant.run('var_red', 'scooter_northstar', 'Northstar EV (Red Edition)', 0, 'Red', '#DC2626', '/scooters/red.jpg', 1, 2);
  insertVariant.run('var_pink', 'scooter_northstar', 'Northstar EV (Pink Edition)', 0, 'Pink', '#EC4899', '/scooters/pink.jpg', 1, 3);
  insertVariant.run('var_skyblue', 'scooter_northstar', 'Northstar EV (Sky Blue Edition)', 0, 'Sky Blue', '#38BDF8', '/scooters/skyblue.jpg', 1, 4);
  insertVariant.run('var_purple', 'scooter_northstar', 'Northstar EV (Purple Edition)', 0, 'Purple', '#A855F7', '/scooters/purple.jpg', 1, 5);
  insertVariant.run('var_darkblue', 'scooter_northstar', 'Northstar EV (Dark Blue Edition)', 0, 'Dark Blue', '#1E40AF', '/scooters/darkblue.jpg', 1, 6);

  // 3. Official Dealership Settings
  const insertSetting = db.prepare(`
    INSERT OR REPLACE INTO settings (key, value, category)
    VALUES (?, ?, ?)
  `);

  insertSetting.run('dealership_name', 'MAA Enterprises', 'general');
  insertSetting.run('vehicle_brand', 'Northstar EV', 'general');
  insertSetting.run('proprietor', 'J.K. Poddar', 'general');
  insertSetting.run('dealership_tagline', 'Ride a Cleaner Tomorrow', 'general');
  insertSetting.run('dealership_secondary_tagline', 'Electric Mobility, A Brighter Tomorrow', 'general');
  insertSetting.run('dealership_address', 'Near SBI Bank, Mahagama', 'contact');
  insertSetting.run('dealership_phone', '9304456205', 'contact');
  insertSetting.run('dealership_phone_alt', '9304456205', 'contact');
  insertSetting.run('whatsapp_business_phone', '919304456205', 'whatsapp');
  insertSetting.run('financing_partner', 'Bajaj Finserv EMI Available', 'finance');
  insertSetting.run('business_category', 'Electric Scooters', 'general');
  insertSetting.run('services_offered', 'Electric Scooter Sales, Service, and Spare Parts', 'general');
  insertSetting.run('ticker_text', '⚡ MAA ENTERPRISES — NORTHSTAR EV • RIDE A CLEANER TOMORROW • BAJAJ FINSERV EMI AVAILABLE • ELECTRIC SCOOTER SALES, SERVICE & GENUINE SPARE PARTS • NEAR SBI BANK, MAHAGAMA • CALL: 9304456205', 'general');

  console.log('Seeded database with MAA Enterprises — Northstar EV official details and colour variants.');
}

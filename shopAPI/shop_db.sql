-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 11, 2022 at 02:20 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(14, 'Cosmetics'),
(13, 'Electronics'),
(12, 'food'),
(15, 'Grocery'),
(18, 'Personal care'),
(17, 'Stationary'),
(16, 'Vegetables and Fruits');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `cust_id` int(11) NOT NULL,
  `cust_name` varchar(30) DEFAULT NULL,
  `address` varchar(30) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`cust_id`, `cust_name`, `address`, `mobile_no`, `email`) VALUES
(16, 'Paramashiva', 'Bajal Mangalore', 8546211258, 'paramashivakaranth@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(30) NOT NULL,
  `stock` int(11) UNSIGNED NOT NULL,
  `wholesale` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `ret_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`item_id`, `item_name`, `stock`, `wholesale`, `price`, `cat_id`, `ret_id`) VALUES
(6, 'Lays', 50, 9, 10, 12, 7),
(7, 'MTR Dry Gulab Jamoon 100g', 50, 89, 100, 12, 7),
(8, 'Dairy Milk Silk 100gms', 23, 92, 99, 12, 7),
(9, 'Torch G-156', 14, 75, 100, 13, 10),
(10, 'Mosquito Bat F-165', 10, 180, 250, 13, 10),
(11, 'Hair Dryer', 20, 800, 999, 13, 10),
(12, 'Lakme Lipstick', 9, 240, 250, 14, 8),
(13, 'Nail Polish', 54, 180, 200, 14, 8),
(14, 'Ponds powder 200g', 23, 190, 200, 14, 8),
(15, 'Aashirvad Atta 1KG', 13, 90, 100, 15, 7),
(16, 'Tata Salt 1KG', 30, 17, 20, 15, 7),
(17, 'MTR Rasam Powder', 95, 9, 10, 15, 7),
(18, 'Carrot 1KG', 11, 60, 80, 16, 11),
(19, 'Tomato 1KG', 5, 30, 40, 16, 11),
(20, 'Banana 1KG', 30, 40, 50, 16, 11),
(21, 'Montex Black ink Pack Pen', 25, 45, 50, 17, 9),
(22, 'Classmate 100 Page', 20, 42, 50, 17, 9),
(23, 'Apsara Pencil Pack', 25, 40, 50, 17, 9),
(24, 'Garnier Men Face Wash 100g', 11, 85, 90, 18, 8),
(25, 'Medimix Soap 100g', 30, 34, 40, 18, 8),
(26, 'Closeup 150g', 11, 90, 100, 18, 8);

-- --------------------------------------------------------

--
-- Table structure for table `item_has_sale`
--

CREATE TABLE `item_has_sale` (
  `item_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `total_price` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `item_has_sale`
--

INSERT INTO `item_has_sale` (`item_id`, `bill_id`, `total_price`, `quantity`) VALUES
(8, 61, 495, 5),
(8, 62, 495, 5),
(8, 63, 495, 5),
(8, 67, 495, 5),
(8, 68, 99, 1),
(8, 70, 99, 1),
(9, 61, 100, 1),
(9, 62, 100, 1),
(9, 63, 100, 1),
(9, 67, 100, 1),
(9, 68, 100, 1),
(9, 70, 100, 1),
(11, 41, 999, 1),
(11, 42, 999, 1),
(12, 61, 750, 3),
(12, 62, 750, 3),
(12, 63, 750, 3),
(12, 67, 750, 3),
(12, 68, 250, 1),
(12, 70, 250, 1),
(14, 40, 400, 2),
(16, 41, 60, 3),
(16, 42, 60, 3),
(17, 41, 30, 3),
(17, 42, 30, 3),
(19, 61, 40, 1),
(19, 62, 40, 1),
(19, 63, 40, 1),
(19, 67, 40, 1),
(19, 68, 40, 1),
(19, 70, 40, 1);

--
-- Triggers `item_has_sale`
--
DELIMITER $$
CREATE TRIGGER `manage_stock` AFTER INSERT ON `item_has_sale` FOR EACH ROW UPDATE items SET stock=stock-new.quantity where item_id = new.item_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `retailer`
--

CREATE TABLE `retailer` (
  `ret_id` int(11) NOT NULL,
  `ret_name` varchar(30) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `mobile_no` bigint(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `retailer`
--

INSERT INTO `retailer` (`ret_id`, `ret_name`, `address`, `mobile_no`, `email`) VALUES
(7, 'Vignesh Traders', 'Ullala Mangalore', 9478562113, 'traders.vignesh@gmail.com'),
(8, 'Alva\'s and Brothers', 'Bolara Mangalore', 8656565641, 'alvabros@gmail.com'),
(9, 'Bekal Stationary', 'Padil Mangalore', 8612324752, 'bekalstationary@gmail.com'),
(10, 'KMK Electronics', 'Manjeshwara, Mangalore', 8565642322, 'kmkelectronics15@gmail.com'),
(11, 'Bayari Vegetables and Fruits', 'Perdur, Udupi', 7889896121, 'bayariyogeesh@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `bill_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `s_date` date DEFAULT current_timestamp(),
  `time` time NOT NULL DEFAULT current_timestamp(),
  `cust_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`bill_id`, `price`, `s_date`, `time`, `cust_id`) VALUES
(40, 400, '2022-01-02', '20:48:36', 16),
(41, 1089, '2022-01-01', '20:48:36', 16),
(42, 1089, '2022-01-03', '20:48:36', 16),
(61, 495, '2022-01-03', '23:02:27', 16),
(62, 0, '2022-01-03', '23:10:08', 16),
(63, 140, '2022-01-03', '23:12:59', 16),
(67, 1385, '2022-01-03', '23:18:50', 16),
(68, 489, '2022-01-03', '23:21:25', 16),
(70, 489, '2022-01-03', '23:23:18', 16);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`cust_id`),
  ADD UNIQUE KEY `mobile_no` (`mobile_no`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`item_id`),
  ADD UNIQUE KEY `item_name` (`item_name`),
  ADD KEY `cat_id` (`cat_id`),
  ADD KEY `ret_id` (`ret_id`);

--
-- Indexes for table `item_has_sale`
--
ALTER TABLE `item_has_sale`
  ADD PRIMARY KEY (`item_id`,`bill_id`),
  ADD KEY `bill_id` (`bill_id`);

--
-- Indexes for table `retailer`
--
ALTER TABLE `retailer`
  ADD PRIMARY KEY (`ret_id`),
  ADD UNIQUE KEY `ret_name` (`ret_name`),
  ADD UNIQUE KEY `mobile_no` (`mobile_no`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `cust_id` (`cust_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `cust_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `retailer`
--
ALTER TABLE `retailer`
  MODIFY `ret_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`cat_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`ret_id`) REFERENCES `retailer` (`ret_id`) ON DELETE CASCADE;

--
-- Constraints for table `item_has_sale`
--
ALTER TABLE `item_has_sale`
  ADD CONSTRAINT `item_has_sale_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `item_has_sale_ibfk_2` FOREIGN KEY (`bill_id`) REFERENCES `sales` (`bill_id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

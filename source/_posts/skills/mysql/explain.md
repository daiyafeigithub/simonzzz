---
title: explain全解析
date: 2025年4月13日15:32:21
tags:
  - mysql
categories:
  - 技术
---

`EXPLAIN` 是 MySQL 中用于分析 SQL 查询执行计划的核心工具。它可以帮助开发者理解 MySQL 如何执行查询（如表连接顺序、索引使用情况、扫描行数等），从而优化查询性能。以下是 `EXPLAIN` 的详细解析和使用示例。

---

### **一、基础语法**
```sql
EXPLAIN [选项] SQL语句;
```
例如：
```sql
EXPLAIN SELECT * FROM users WHERE id = 1;
```

---

### **二、输出字段详解**
`EXPLAIN` 的输出结果包含以下关键字段，每个字段反映了查询执行计划的细节：

#### **1. id**
- **含义**：查询的唯一标识符。
- **规则**：
  - 简单查询（单表）的 `id` 相同。
  - 复杂查询（如子查询、联合查询）中，每个子查询会生成不同的 `id`。
  - `id` 值越大，优先级越高，越先执行。

#### **2. select_type**
- **含义**：查询的类型。
- **常见值**：
  - `SIMPLE`：简单查询（不包含子查询或 UNION）。
  - `PRIMARY`：最外层的查询（包含子查询或 UNION）。
  - `SUBQUERY`：子查询中的第一个 SELECT。
  - `DERIVED`：派生表（如 FROM 子句中的子查询）。
  - `UNION`：UNION 中的第二个或后续 SELECT。
  - `UNION RESULT`：UNION 的结果。

#### **3. table**
- **含义**：当前操作的表名。
- **示例**：`<derived2>` 表示一个派生表（临时表）。

#### **4. partitions**
- **含义**：涉及的分区（如果表是分区表）。

#### **5. type**
- **含义**：访问类型（从最优到最差）：
  - `system`：表只有一行（系统表）。
  - `const`：通过主键或唯一索引匹配一行。
  - `eq_ref`：唯一索引扫描（多表连接时）。
  - `ref`：非唯一索引扫描。
  - `range`：索引范围扫描。
  - `index`：全索引扫描（覆盖索引）。
  - `ALL`：全表扫描（需优化）。
- **优化目标**：尽量避免 `ALL`，追求 `const`、`eq_ref`、`ref`。

#### **6. possible_keys**
- **含义**：可能应用的索引列表。

#### **7. key**
- **含义**：实际使用的索引。

#### **8. key_len**
- **含义**：索引使用的字节数。
- **作用**：判断联合索引是否被完全使用。
- **示例**：若索引是 `(a, b)`，`key_len` 为 `a` 的长度，说明只使用了部分索引。

#### **9. ref**
- **含义**：索引的哪一列或常量被用于匹配。
- **示例**：`const`（常量）、`func`（函数）、`某个字段`。

#### **10. rows**
- **含义**：预估需要扫描的行数。
- **优化目标**：越小越好。

#### **11. filtered**
- **含义**：通过条件过滤的行百分比（与 `rows` 结合估算实际行数）。

#### **12. Extra**
- **含义**：额外信息，关键优化提示。
- **常见值**：
  - `Using where`：使用 WHERE 条件过滤。
  - `Using index`：使用覆盖索引（无需回表）。
  - `Using temporary`：使用临时表（需优化）。
  - `Using filesort`：使用文件排序（需优化）。
  - `Select tables optimized away`：查询被优化器直接返回结果（如聚合函数）。

---

### **三、示例分析**
#### **示例 1：全表扫描**
```sql
EXPLAIN SELECT * FROM employees;
```
**输出**：
```
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------+
| 1  | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 3000 | 100.00   | NULL  |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------+
```
**分析**：
- `type` 为 `ALL`（全表扫描），需添加索引优化。

---

#### **示例 2：使用索引**
```sql
EXPLAIN SELECT name FROM employees WHERE id = 1;
```
**输出**：
```
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
| 1  | SIMPLE      | employees | NULL       | const | PRIMARY       | PRIMARY | 4       | const | 1    | 100.00   | Using index |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
```
**分析**：
- `type` 为 `const`（主键查询），`Using index` 表示使用了覆盖索引。

---

#### **示例 3：复杂查询（JOIN）**
```sql
EXPLAIN SELECT a.name, b.salary 
FROM employees a 
JOIN salaries b ON a.id = b.employee_id 
WHERE a.department = 'IT';
```
**输出**：
```
+----+-------------+-------+------------+------+---------------+---------+---------+----------------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key     | key_len | ref            | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+---------+---------+----------------+------+----------+-------------+
| 1  | SIMPLE      | a     | NULL       | ref  | idx_dept      | idx_dept| 768     | const          | 100  | 100.00   | Using where |
| 1  | SIMPLE      | b     | NULL       | ref  | emp_id        | emp_id  | 4       | test.a.id      | 10   | 100.00   | NULL        |
+----+-------------+-------+------------+------+---------------+---------+---------+----------------+------+----------+-------------+
```
**分析**：
- `employees` 表通过 `idx_dept` 索引筛选出 100 行。
- `salaries` 表通过 `emp_id` 索引与 `employees` 表关联。

---

### **四、优化建议**
1. **避免全表扫描（ALL）**  
   - 为 WHERE、JOIN、ORDER BY 条件添加合适的索引。
   - 示例：`ALTER TABLE employees ADD INDEX idx_dept (department);`

2. **减少回表（Using index）**  
   - 使用覆盖索引（查询字段全部包含在索引中）。

3. **优化临时表和文件排序**  
   - 减少复杂查询中的 `DISTINCT`、`GROUP BY`、`ORDER BY`。
   - 确保排序字段有索引。

4. **关联查询优化**  
   - 小表驱动大表。
   - 确保关联字段有索引。

---

### **五、常见误区**
- **索引越多越好？**  
  错误。过多的索引会降低写入性能，需权衡查询与写入需求。

- **EXPLAIN 的 rows 是准确的？**  
  不准确。它是 MySQL 的预估值，实际行数可能不同。

- **type = range 一定比 ref 差？**  
  不一定。范围查询可能更高效，需结合具体场景。

---

### **六、进阶用法**
1. **分析 UPDATE/DELETE**  
   ```sql
   EXPLAIN UPDATE employees SET salary = 10000 WHERE department = 'IT';
   ```

2. **查看分区信息**  
   ```sql
   EXPLAIN PARTITIONS SELECT * FROM partitioned_table;
   ```

3. **结合 SHOW WARNINGS**  
   ```sql
   EXPLAIN EXTENDED SELECT ...;
   SHOW WARNINGS;
   ```

---

### **总结**
通过 `EXPLAIN`，可以快速定位查询性能瓶颈，优化索引和 SQL 逻辑。建议在开发过程中对复杂查询进行常态化分析，避免生产环境出现慢查询。
package com.hachionUserDashboard.dto;


public class CourseSummaryDto {

    private int id;
    private String courseName;
    private String courseImage;
    private String numberOfClasses;
    private String level;

    private Double amount;
    private Double discount;
    private Double total;

    private Double iamount;
    private Double idiscount;
    private Double itotal;

    private String courseCategory;

    public CourseSummaryDto() {
    }

    public CourseSummaryDto(int id,
                            String courseName,
                            String courseImage,
                            String numberOfClasses,
                            String level,
                            Double amount,
                            Double discount,
                            Double total,
                            Double iamount,
                            Double idiscount,
                            Double itotal,
                            String courseCategory) {
        this.id = id;
        this.courseName = courseName;
        this.courseImage = courseImage;
        this.numberOfClasses = numberOfClasses;
        this.level = level;
        this.amount = amount;
        this.discount = discount;
        this.total = total;
        this.iamount = iamount;
        this.idiscount = idiscount;
        this.itotal = itotal;
        this.courseCategory = courseCategory;
    }

    // getters & setters

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseImage() { return courseImage; }
    public void setCourseImage(String courseImage) { this.courseImage = courseImage; }

    public String getNumberOfClasses() { return numberOfClasses; }
    public void setNumberOfClasses(String numberOfClasses) { this.numberOfClasses = numberOfClasses; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Double getIamount() { return iamount; }
    public void setIamount(Double iamount) { this.iamount = iamount; }

    public Double getIdiscount() { return idiscount; }
    public void setIdiscount(Double idiscount) { this.idiscount = idiscount; }

    public Double getItotal() { return itotal; }
    public void setItotal(Double itotal) { this.itotal = itotal; }

    public String getCourseCategory() { return courseCategory; }
    public void setCourseCategory(String courseCategory) { this.courseCategory = courseCategory; }
}
package com.hachionUserDashboard.dto;

public class SocialLinksUpdateResponse {

    private String facebook;
    private String twitter;
    private String linkedin;
    private String website;
    private String github;

    
    public String getFacebook() { return facebook; }
    public void setFacebook(String facebook) { this.facebook = facebook; }

    public String getTwitter() { return twitter; }
    public void setTwitter(String twitter) { this.twitter = twitter; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
}
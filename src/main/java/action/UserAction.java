package action;

import encode.MD5Util;
import model.User;
import net.sf.json.JSONArray;
import service.AppService;

import javax.servlet.http.HttpSession;
import java.io.PrintWriter;
import java.util.ArrayList;

public class UserAction extends BaseAction {
    private static final long serialVersionUID = 1L;

    private AppService appService;
    private int id;
    private String username;
    private String password;
    private String email;
    private String phone;

    public void setAppService(AppService appService){
        this.appService=appService;
    }

    public void setId(int id){ this.id=id; }
    public int getId(){ return id; }

    public void setUsername(String username){ this.username=username; }
    public String getUsername(){ return username; }

    public void setPassword(String password){ this.password=password; }
    public String getPassword(){ return password; }

    public void setEmail(String email){ this.email=email; }
    public String getEmail(){ return email; }

    public void setPhone(String phone){ this.phone=phone; }
    public String getPhone(){ return phone; }

    public String register() throws Exception {
        PrintWriter out = response().getWriter();
        if (appService.getUserByPhone(phone)==null){
            User user=new User(username,MD5Util.md5Encode(password),email,phone);
            int id=appService.addUser(user);
            ArrayList<String> ur=new ArrayList<String>();
            ur.add(String.valueOf(id));
            out.println(JSONArray.fromObject(ur));
        }
        else{
            ArrayList<String> ur=new ArrayList<String>();
            ur.add("0");
            out.println(JSONArray.fromObject(ur));
        }
        out.flush();
        out.close();
        return null;
    }

    public String login() throws Exception{
        PrintWriter out = response().getWriter();
        User user=appService.getUserById(id);
        if (user!=null){
            if (MD5Util.md5Encode(password).equals(user.getPassword())){
                HttpSession session=request().getSession();
                session.setAttribute("userid",user.getId());
                session.setAttribute("username",user.getUsername());
                session.setAttribute("phone",user.getPhone());
                session.setAttribute("email", user.getEmail());

                ArrayList<String> ur=new ArrayList<String>();
                ur.add(String.valueOf(id));
                ur.add(user.getUsername());
                ur.add(user.getPhone());
                ur.add(user.getEmail());
                out.println(JSONArray.fromObject(ur));
            }
            else{
                ArrayList<String> ur=new ArrayList<String>();
                ur.add("0");
                out.println(JSONArray.fromObject(ur));
            }
        }
        else{
            ArrayList<String> ur=new ArrayList<String>();
            ur.add("-1");
            out.println(JSONArray.fromObject(ur));
        }
        out.flush();
        out.close();
        return null;
    }

    public String logout() throws Exception{
        request().getSession().setAttribute("userid",-1);
        return null;
    }

    public String querySessionUser() throws Exception{
        PrintWriter out = response().getWriter();
        HttpSession session=request().getSession();
        ArrayList<String> ur=new ArrayList<String>();
        ur.add(session.getAttribute("userid").toString());
        ur.add(session.getAttribute("username").toString());
        ur.add(session.getAttribute("phone").toString());
        ur.add(session.getAttribute("email").toString());
        out.println(JSONArray.fromObject(ur));
        out.flush();
        out.close();
        return null;
    }
}

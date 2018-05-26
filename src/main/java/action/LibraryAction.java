package action;

import model.Question;
import model.ULKey;
import model.UQ_Library;
import model.User;
import net.sf.json.JSONArray;
import service.AppService;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class LibraryAction extends BaseAction {
    private static final long serialVersionUID = 1L;

    private AppService appService;

    private int libraryId;
    private String name;
    private String content;
    private String reference;
    private String tagOne;
    private String tagTwo;
    private boolean frequency;
    private boolean date;

    public void setAppService(AppService appService){
        this.appService=appService;
    }

    public int getLibraryId() { return libraryId; }
    public void setLibraryId(int libraryId) { this.libraryId = libraryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getTagOne() { return tagOne; }
    public void setTagOne(String tagOne) { this.tagOne = tagOne; }

    public String getTagTwo() { return tagTwo; }
    public void setTagTwo(String tagTwo) { this.tagTwo = tagTwo; }

    public boolean isFrequency() { return frequency; }
    public void setFrequency(boolean frequency) { this.frequency = frequency; }

    public boolean isDate() { return date; }
    public void setDate(boolean date) { this.date = date; }

    public String queryUserLibraries() throws Exception{
        Object o= request().getSession().getAttribute("userid");
        int owner;
        if (o==null){owner=-1;}
        else {owner=Integer.parseInt(o.toString());}

        PrintWriter out = response().getWriter();

        if (owner==-1){
            ArrayList<JSONArray> qJ= new ArrayList<JSONArray>();
            ArrayList<String> ur=new ArrayList<String>();
            ur.add("-1");
            qJ.add(JSONArray.fromObject(ur));
            out.println(JSONArray.fromObject(qJ));
        }
        else{
            List<UQ_Library> res;
            if (owner==111111){ //admin
                res=appService.getAllLibraries();
            }
            else{ //user
                res=appService.getAllLibrariesById(owner);
            }
            Iterator it = res.iterator();
            ArrayList<JSONArray> qJ= new ArrayList<JSONArray>();
            while (it.hasNext()) {
                UQ_Library lib = (UQ_Library) it.next();
                ArrayList<String> arrayList = new ArrayList<String>();
                arrayList.add(String.valueOf(lib.getUlKey().getLibraryId()).trim());
                arrayList.add(lib.getQuestion().getName());
                arrayList.add(lib.getTagOne()+" "+lib.getTagTwo());
                arrayList.add(String.valueOf(lib.getFrequency()));
                arrayList.add(String.valueOf(lib.getDate()));
                arrayList.add(String.valueOf(lib.getQuestion().getOwner().getId()));
                qJ.add(JSONArray.fromObject(arrayList));
            }
            JSONArray q=JSONArray.fromObject(qJ.toArray());
            out.println(q);
        }
        out.flush();
        out.close();
        return null;
    }

    public String queryCommonLibraries() throws Exception{
        PrintWriter out = response().getWriter();
        List<UQ_Library> res=appService.getAllLibrariesById(111111);
        Iterator it = res.iterator();
        ArrayList<JSONArray> qJ= new ArrayList<JSONArray>();
        while (it.hasNext()) {
            UQ_Library lib = (UQ_Library) it.next();
            ArrayList<String> arrayList = new ArrayList<String>();
            arrayList.add(String.valueOf(lib.getUlKey().getLibraryId()).trim());
            arrayList.add(lib.getQuestion().getName());
            arrayList.add(lib.getTagOne()+" "+lib.getTagTwo());
            arrayList.add(String.valueOf(lib.getFrequency()));
            arrayList.add(String.valueOf(lib.getDate()));
            arrayList.add(String.valueOf(lib.getQuestion().getOwner().getId()));
            arrayList.add(String.valueOf(lib.getQuestion().getOwner().getUsername()));
            arrayList.add(String.valueOf(lib.getQuestion().getContent()));
            arrayList.add(String.valueOf(lib.getQuestion().getReference()));
            qJ.add(JSONArray.fromObject(arrayList));
        }
        JSONArray q=JSONArray.fromObject(qJ.toArray());
        out.println(q);
        out.flush();
        out.close();
        return null;
    }

    //in:libraryId
    public String addLibraries() throws Exception{
        int owner=Integer.parseInt(request().getSession()
                .getAttribute("userid").toString());
        User u=appService.getUserById(owner);
        Question q=new Question();
        q.setName(name);
        q.setContent(content);
        q.setOwner(u);
        appService.addQuestion(q);

        UQ_Library l=new UQ_Library();
        l.setUlKey(new ULKey(owner,libraryId));
        l.setQuestion(q);
        l.setTagOne(tagOne);
        l.setTagTwo(tagTwo);
        l.setFrequency(0);
        l.setDate(new Date());
        appService.addLibrary(l);

        return null;
    }

    //in:libraryId
    public String deleteLibraries() throws Exception{
        int owner=Integer.parseInt(request().getSession()
                .getAttribute("userid").toString());

        UQ_Library l=appService.getLibraryByKey(new ULKey(owner,libraryId));
        Question q=l.getQuestion();
        appService.deleteLibrary(l);
        appService.deleteQuestion(q);
        return null;
    }

    //in: libraryId(name/content/reference)
    public String updateQuestions() throws Exception{
        int owner=Integer.parseInt(request().getSession()
                .getAttribute("userid").toString());

        UQ_Library l=appService.getLibraryByKey(new ULKey(owner,libraryId));
        Question q=l.getQuestion();
        if (name != null){
            q.setName(name);
        }
        if (content != null){
            q.setContent(content);
        }
        if (reference != null){
            q.setReference(reference);
        }
        appService.updateQuestion(q);

        return null;
    }

    //in: libraryId(tagOne/tagTwo/frequency/data)
    public String updateLibraries() throws Exception{
        int owner=Integer.parseInt(request().getSession()
                .getAttribute("userid").toString());

        UQ_Library l=appService.getLibraryByKey(new ULKey(owner,libraryId));

        if (tagOne != null){
            l.setTagOne(tagOne);
        }
        if (tagTwo != null){
            l.setTagTwo(tagTwo);
        }
        if (date){
            l.setDate(new Date());
        }
        if (frequency){
            l.setFrequency(l.getFrequency()+1);
        }
        appService.updateLibrary(l);

        return null;
    }

    //in:libraryId
    public String queryDetails() throws Exception{
        int owner=Integer.parseInt(request().getSession()
                .getAttribute("userid").toString());
        PrintWriter out = response().getWriter();
        UQ_Library l=appService.getLibraryByKey(new ULKey(owner,libraryId));
        ArrayList<String> arrayList = new ArrayList<String>();
        arrayList.add(l.getQuestion().getName());
        arrayList.add(l.getQuestion().getContent());
        arrayList.add(l.getQuestion().getReference());
        arrayList.add(l.getQuestion().getOwner().getUsername());
        arrayList.add(l.getDate().toString());
        arrayList.add(String.valueOf(libraryId));
        //arrayList.add(String.valueOf(owner));
        arrayList.add(String.valueOf(l.getQuestion().getOwner().getId()));
        out.println(JSONArray.fromObject(arrayList));
        return null;
    }
}

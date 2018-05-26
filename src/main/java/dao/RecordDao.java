package dao;

import model.URKey;
import model.Record;

import java.io.UnsupportedEncodingException;
import java.sql.Blob;
import java.util.List;

public interface RecordDao {
    public void save(Record record);

    public void delete(Record record);

    public void update(Record record);

    public Record getRecordByKey(URKey key);

    public List<Record> getAllRecords(int userId,int libraryId);

    public Blob convertBlob(String ans) throws UnsupportedEncodingException;
}
